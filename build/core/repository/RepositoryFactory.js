import { EsQueryDsl } from './dtos/EsQuery';
import { ConfigCenter } from "../config/ConfigCenter";
import { FrameworkCache } from "../cache/Cache";
import { AddCacheDto } from "../cache/dtos/AddCacheDto";
import { GetCacheInput } from "../cache/dtos/GetCacheInput";
import moment from 'moment';
import { Common } from "../common /Common";
export class RepositoryFactory {
    static CreateRepositoryInstance(Entity) {
        let esClient = this.ConfigCenter.GetEsClientInstance();
        let repository;
        let entityInfo = new Entity().GetEntityInfo();
        if (esClient)
            repository = new EsClientRepository(entityInfo.Index, entityInfo.Type, Entity);
        else
            repository = new EsHttpRepository(entityInfo.Index, entityInfo.Type, Entity);
        let cashKey = "R_" + entityInfo.Name;
        let obj = new AddCacheDto(cashKey, repository, 0);
        this.FrameworkCache.AddCache(obj);
        return true;
    }
    static GetRepositoryInstance(Entity) {
        let entityInfo = new Entity().GetEntityInfo();
        let cashKey = "R_" + entityInfo.Name;
        let input = new GetCacheInput(cashKey);
        return this.FrameworkCache.GetCache(input);
    }
}
RepositoryFactory.ConfigCenter = ConfigCenter.GetInstance();
RepositoryFactory.FrameworkCache = FrameworkCache.GetCacheInstance();
class BaseRepository {
    constructor(index, type, Entity) {
        this.ParmsToDsl = function (type, key, val) {
            let obj = {};
            obj[type] = {};
            obj[type][key] = val;
            return obj;
        };
        this.EntityInfo = new Entity();
        this.Index = index;
        this.Type = type;
        this.ConfigCenter = ConfigCenter.GetInstance();
        this.Request = this.ConfigCenter.GetRequestInstance();
    }
    ConstructionDsl(params) {
        let query = new EsQueryDsl({ Query: { and: [] } });
        for (const key in params.filter) {
            if (params.filter.hasOwnProperty(key)) {
                const element = params.filter[key];
                let dslObjType = 'term';
                if (element && element.gte) {
                    dslObjType = 'range';
                }
                else if (element && element._match) {
                    dslObjType = 'match';
                }
                else {
                    if (Object.prototype.toString.call(element) == '[object Array]') {
                        dslObjType = 'terms';
                    }
                    else {
                        dslObjType = 'term';
                    }
                }
                if (element._match)
                    query.query.and.push(this.ParmsToDsl(dslObjType, key, element._match));
                else
                    query.query.and.push(this.ParmsToDsl(dslObjType, key, element));
            }
        }
        if (params.aggs) {
            query.aggs = {};
            for (const key in params.aggs) {
                if (params.aggs.hasOwnProperty(key)) {
                    const element = params.aggs[key];
                    if (element.length < 1)
                        break;
                    element.forEach(item => {
                        query.aggs[key + '_' + item] = this.ParmsToDsl(key, 'field', item);
                    });
                }
            }
        }
        else if (params.groupby) {
            query.aggs = {};
            for (const key in params.groupby) {
                if (params.groupby.hasOwnProperty(key)) {
                    const element = params.groupby[key];
                    if (element) {
                        if (element.length < 1)
                            break;
                        let terms = { "field": key, "size": 500 };
                        let aggregations = {};
                        for (const aggKey in element) {
                            if (element.hasOwnProperty(aggKey)) {
                                const aggElement = element[aggKey];
                                if (aggElement.length < 1)
                                    break;
                                aggElement.forEach((item) => {
                                    aggregations[aggKey + '_' + item] = this.ParmsToDsl(aggKey, 'field', item);
                                });
                            }
                        }
                        query.aggs[key] = {
                            terms: {
                                "field": key,
                                "size": 500
                            },
                            aggregations: aggregations
                        };
                    }
                }
            }
        }
        query._source = params.select;
        if (params.size)
            query.size = params.size;
        console.log("生成的Dsl语句是:", query);
        return query;
    }
    CtorDefaultParams(filter) {
        let storeInfo = this.ConfigCenter.GetStoreInfo();
        let brandInfo = this.ConfigCenter.GetBrandInfo();
        if (filter && typeof filter === "object") {
            for (const key in filter) {
                if (filter.hasOwnProperty(key)) {
                    if (filter[key] && typeof filter[key] === "object") {
                        if (key === "brandId" || key === "brand_id" || key === "storeId" || key === "store_id") {
                            if (Object.prototype.toString.call(filter[key]) === '[object Array]') {
                                let storeIdOrBrandId = (key === "brandId" || key === "brand_id") ? brandInfo.brandId : storeInfo.storeId;
                                for (let index = 0; index < filter[key].length; index++) {
                                    const element = filter[key][index];
                                    if (element === '#')
                                        filter[key][index] = storeIdOrBrandId + "";
                                }
                            }
                        }
                        else
                            this.CtorDefaultParams(filter[key]);
                    }
                    else {
                        if ((key === "brandId" || key === "brand_id") && filter[key] === '#') {
                            filter[key] = brandInfo.brandId + '';
                        }
                        if ((key === "storeId" || key === "store_id") && filter[key] === '#') {
                            filter[key] = storeInfo.storeId + '';
                        }
                    }
                }
            }
        }
        return filter;
    }
    GetAll(query) {
        let dsl = this.ConstructionDsl(query);
        return this.GetAllByDsl(dsl);
    }
    UpdateById(entity) {
        return this.UpdateByQuery({}, entity);
    }
    UpdateByEsId(entity, esId) {
        entity.id = esId;
        return this.CreateOrUpdate(entity);
    }
    Create(entity) {
        if (!entity.id) {
            entity.id = Common.GetUuid();
        }
        return this.CreateOrUpdate(entity);
    }
    ;
}
class EsHttpRepository extends BaseRepository {
    constructor(index, type, Entity) {
        super(index, type, Entity);
        this._esProxyUrl = this.ConfigCenter.GetGlobalUrl().EsProxyUrl;
        this._fullRequestUrl = `${this._esProxyUrl}${this.Index}/${this.Type}/`;
    }
    GetAllByDsl(query) {
        let dsl = this.CtorDefaultParams(query);
        let url = `${this._fullRequestUrl}_search`;
        if (!query._source) {
            query._source = [];
            let fileds = Object.keys(this.EntityInfo);
            for (let index = 0; index < fileds.length; index++) {
                const filedName = fileds[index];
                const filed = this.EntityInfo[filedName];
                if (filed && typeof filed === "object") {
                    let childFileds = Object.keys(filed);
                    for (let index = 0; index < childFileds.length; index++) {
                        const childFiledName = `${filedName}.${childFileds[index]}`;
                        query._source.push(childFiledName);
                    }
                }
                else {
                    query._source.push(filedName);
                }
            }
        }
        return this.Request.Request("POST", url, dsl).then((res) => {
            if (res) {
                let data = [];
                let aggs;
                if (res.hits && res.hits.hits) {
                    res.hits.hits.forEach((element) => {
                        if (element && element._source) {
                            let entity = element._source;
                            entity._id = element._id;
                            data.push(entity);
                        }
                    });
                }
                if (res.aggregations) {
                    aggs = res.aggregations;
                }
                return { data: data, aggs: aggs };
            }
            return null;
        }, err => {
            console.error(err);
            return null;
        });
    }
    UpdateByQuery(params, entity) {
        if (!params || !params.filter)
            throw new Error("查询条件为空!");
        params = this.CtorDefaultParams(params);
        let script = {
            inline: ""
        };
        if (entity.CheckImplements("IHasModificationTime")) {
            entity.modificationTime = moment().valueOf();
        }
        if (entity.CheckImplements("IHasModificationMember")) {
            let sysInfo = this.ConfigCenter.GetSysInfo();
            entity.modificationMemberId = sysInfo.sysId;
            entity.modificationMemberName = sysInfo.sysName;
        }
        for (const key in entity) {
            if (params.doc.hasOwnProperty(key)) {
                const element = entity[key];
                if (element) {
                    let sourceScrpit = "";
                    if (typeof element == 'string')
                        sourceScrpit = 'ctx._source.' + key + ' = "' + element + '";';
                    else if (typeof element == 'number')
                        sourceScrpit = 'ctx._source.' + key + ' = ' + element + ';';
                    else
                        throw new Error('因为作者水平低，所以不支持对象更新，只支持number和string的数据类型更新，要更新对象的话请自行解决。');
                    script.inline += sourceScrpit;
                }
            }
        }
        let queryDsl = this.ConstructionDsl({ filter: params.filter });
        let url = `${this._fullRequestUrl}_update`;
        let data = {
            query: queryDsl.query,
            script: script
        };
        return this.Request.Request("POST", url, data).then(res => {
            console.log("EsUpdateByParams", res);
            return res.data.updated;
        }, err => {
            console.error(err);
            return null;
        });
    }
    CreateOrUpdate(entity) {
        if (!entity.id) {
            entity.id = Common.GetUuid();
            if (entity.CheckImplements("IBrand")) {
                let brandIdInfo = this.ConfigCenter.GetBrandInfo();
                entity.brandId = brandIdInfo.brandId;
            }
            if (entity.CheckImplements("IStore")) {
                let storeInfo = this.ConfigCenter.GetStoreInfo();
                entity.storeId = storeInfo.storeId;
            }
            if (entity.CheckImplements("IHasCreationTime")) {
                entity.creationTime = moment().valueOf();
            }
            if (entity.CheckImplements("IHasCreationMember")) {
                let sysInfo = this.ConfigCenter.GetSysInfo();
                entity.creationMemberId = sysInfo.sysId;
                entity.creationMemberName = sysInfo.sysName;
            }
        }
        else {
            if (entity.CheckImplements("IHasModificationTime")) {
                entity.modificationTime = moment().valueOf();
            }
            if (entity.CheckImplements("IHasModificationMember")) {
                let sysInfo = this.ConfigCenter.GetSysInfo();
                entity.modificationMemberId = sysInfo.sysId;
                entity.modificationMemberName = sysInfo.sysName;
            }
        }
        let url = `${this._fullRequestUrl}${entity.id}`;
        return this.Request.Request("POST", url, entity).then(res => {
            return res.created;
        });
    }
    DeleteByQuery(query) {
        throw new Error("暂时不支持DeleteByQuery;");
    }
    DeleteById(id) {
        throw new Error("暂时不支持本操作;");
    }
    DeleteByEsId(esId) {
        let url = `${this._fullRequestUrl}${esId}`;
        return this.Request.Request("DELETE", url).then(res => {
            return res.found;
        });
    }
}
class EsClientRepository extends BaseRepository {
    GetAllByDsl(query) {
        throw new Error("Method not implemented.");
    }
    UpdateByQuery(query, entity) {
        throw new Error("Method not implemented.");
    }
    CreateOrUpdate(entity) {
        throw new Error("Method not implemented.");
    }
    DeleteByQuery(query) {
        throw new Error("Method not implemented.");
    }
    DeleteById(id) {
        throw new Error("Method not implemented.");
    }
    DeleteByEsId(esId) {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=RepositoryFactory.js.map