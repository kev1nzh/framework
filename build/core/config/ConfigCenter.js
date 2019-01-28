import { AddCacheDto } from "../cache/dtos/AddCacheDto";
import { GetCacheInput } from "../cache/dtos/GetCacheInput";
import { UpdateCacheDto } from "../cache/dtos/UpdateCacheDto";
import { FrameworkCache } from "../cache/Cache";
export class ConfigCenter {
    constructor() {
        this._brandCacheKey = "BrandInfo";
        this._storeCacheKey = "StoreInfo";
        this._sysMemberCacheKey = "SysMember";
        this._requestInstanceCacheKey = "RequestInstance";
        this._repositoryInstanceCacheKey = "R";
        this._esClientCacheKey = "EsClient";
        this._businessCacheKey = "BusinessCache";
        this._globalUrlCacheKey = "GlobalUrl";
        this._frameworkCache = FrameworkCache.GetCacheInstance();
        this._cache = this.GetCacheInstance();
    }
    static GetInstance() {
        if (!this._configCenter)
            this._configCenter = new ConfigCenter();
        return this._configCenter;
    }
    SetBrandInfo(brandInfo) {
        let obj = new AddCacheDto(this._brandCacheKey, brandInfo, 0);
        this._cache.AddCache(obj);
        this._frameworkCache.AddCache(obj);
        return true;
    }
    GetBrandInfo() {
        let input = new GetCacheInput(this._brandCacheKey);
        return this._frameworkCache.GetCache(input);
    }
    UpdateBrandInfo(brandInfo) {
        let obj = new UpdateCacheDto(this._brandCacheKey, brandInfo);
        this._cache.UpdateCache(obj);
        this._frameworkCache.UpdateCache(obj);
        return true;
    }
    SetStoreInfo(storeInfo) {
        let obj = new AddCacheDto(this._storeCacheKey, storeInfo, 0);
        this._frameworkCache.AddCache(obj);
        if (this._cache) {
            this._cache.AddCache(obj);
        }
        return true;
    }
    GetStoreInfo() {
        let input = new GetCacheInput(this._storeCacheKey);
        return this._frameworkCache.GetCache(input);
    }
    UpdateStoreInfo(storeInfo) {
        let obj = new UpdateCacheDto(this._storeCacheKey, storeInfo);
        this._frameworkCache.UpdateCache(obj);
        if (this._cache) {
            this._cache.UpdateCache(obj);
        }
        return true;
    }
    SetSysInfo(sysInfo) {
        let timeSpan = 1000 * 60 * 60 * 2;
        let obj = new AddCacheDto(this._sysMemberCacheKey, sysInfo, timeSpan);
        this._frameworkCache.AddCache(obj);
        if (this._cache) {
            this._cache.AddCache(obj);
        }
        return true;
    }
    GetSysInfo() {
        let input = new GetCacheInput(this._sysMemberCacheKey);
        return this._frameworkCache.GetCache(input);
    }
    UpdateSysInfo(sysInfo) {
        let obj = new UpdateCacheDto(this._sysMemberCacheKey, sysInfo);
        this._frameworkCache.UpdateCache(obj);
        if (this._cache) {
            this._cache.UpdateCache(obj);
        }
        return true;
    }
    SetGlobalUrl(globalUrlInfo) {
        let obj = new AddCacheDto(this._globalUrlCacheKey, globalUrlInfo, 0);
        this._frameworkCache.AddCache(obj);
        return true;
    }
    GetGlobalUrl() {
        let input = new GetCacheInput(this._globalUrlCacheKey);
        return this._frameworkCache.GetCache(input);
    }
    SetRequestInstance(request) {
        let obj = new AddCacheDto(this._requestInstanceCacheKey, request, 0);
        this._frameworkCache.AddCache(obj);
        return true;
    }
    GetRequestInstance() {
        let input = new GetCacheInput(this._requestInstanceCacheKey);
        return this._frameworkCache.GetCache(input);
    }
    GetRepositoryInstance(key) {
        let cashKey = this._repositoryInstanceCacheKey + "_" + key;
        let input = new GetCacheInput(cashKey);
        return this._frameworkCache.GetCache(input);
    }
    SetEsClientInstance(esClient) {
        let obj = new AddCacheDto(this._esClientCacheKey, esClient, 0);
        this._frameworkCache.AddCache(obj);
        return true;
    }
    GetEsClientInstance() {
        let input = new GetCacheInput(this._esClientCacheKey);
        return this._frameworkCache.GetCache(input);
    }
    SetCacheInstance(cacheInstance) {
        this._cache = cacheInstance;
        let obj = new AddCacheDto(this._businessCacheKey, cacheInstance, 0);
        this._frameworkCache.AddCache(obj);
        return true;
    }
    GetCacheInstance() {
        let input = new GetCacheInput(this._businessCacheKey);
        return this._frameworkCache.GetCache(input);
    }
}
export class GlobalUrlInfo {
    constructor(info) {
        this.EsProxyUrl = info.EsProxyUrl;
        this.CloudStoreApi = info.CloudStoreApi;
    }
}
//# sourceMappingURL=ConfigCenter.js.map