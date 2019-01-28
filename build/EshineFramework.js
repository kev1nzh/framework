import { FrameworkCache, MemoryCache } from "./core/cache/Cache";
import { ConfigCenter } from "./core/config/ConfigCenter";
import { BrandInfo } from "./core/entities/BrandInfo";
import { StoreInfo } from "./core/entities/StoreInfo";
import { RepositoryFactory } from "./core/repository/RepositoryFactory";
import { BigData } from "./core/entities/BigData";
import { EsQuery, EsQueryDsl } from "./core/repository/dtos/EsQuery";
import { BigData2 } from "./core/entities/BigData2";
import { MemberService } from "./application/members/MemberService";
import { ApplicationServiceFactory } from "./application/ApplicationServiceFactory";
import { ProductService } from "./application/products/ProductService";
import { Product } from "./core/entities/products/Product";
import { BrandService } from "./application/brands/BrandService";
export class EshineFramework {
    constructor(config) {
        this._configCenter = ConfigCenter.GetInstance();
        this._frameworkCache = FrameworkCache.GetCacheInstance();
        this.HttpRequest = config.Request;
        this._configCenter.SetRequestInstance(config.Request);
        this._configCenter.SetGlobalUrl(config.GlobalUrlInfo);
        let busCache = config.Cache ? config.Cache : MemoryCache.GetCacheInstance();
        this._configCenter.SetCacheInstance(busCache);
        this.Cache = busCache;
        if (config.EsClient)
            this._configCenter.SetEsClientInstance(config.EsClient);
        this.InitializationRepository();
        this.Service = {};
        this.InitializationServices();
        this.InitializationNchanSubscriber();
    }
    InitializationNchanSubscriber() {
    }
    InitializationRepository() {
        this.Service = {};
        RepositoryFactory.CreateRepositoryInstance(BigData);
        RepositoryFactory.CreateRepositoryInstance(BigData2);
        RepositoryFactory.CreateRepositoryInstance(Product);
    }
    InitializationServices() {
        let memberService = ApplicationServiceFactory.RegisterServiceInstance(MemberService);
        this.Service["IMemberService"] = memberService;
        let productService = ApplicationServiceFactory.RegisterServiceInstance(ProductService);
        this.Service["IProductService"] = productService;
        let brandService = ApplicationServiceFactory.RegisterServiceInstance(BrandService);
        this.Service["IBrandService"] = brandService;
    }
    InitializationFramework(data) {
        if (data.brandInfo)
            this._configCenter.SetBrandInfo(data.brandInfo);
        if (data.storeInfo)
            this._configCenter.SetStoreInfo(data.storeInfo);
        if (data.sysInfo)
            this._configCenter.SetSysInfo(data.sysInfo);
    }
    Test() {
        console.log("开始测试....");
        let brandInfo = new BrandInfo(100224, "上海壹向测试");
        this._configCenter.SetBrandInfo(brandInfo);
        let storeInfo = new StoreInfo(300881, "测试数据门店");
        this._configCenter.SetStoreInfo(storeInfo);
        this._configCenter.UpdateBrandInfo(new BrandInfo(100224, "胡莱莱"));
        let globalUrlInfo = this._configCenter.GetGlobalUrl();
        let url = globalUrlInfo.CloudStoreApi + "IStores";
        let reqData = { filter: { "where": { "brandId": 100224 } } };
        this.HttpRequest.Request("GET", url, reqData).then(res => {
            console.log("单个请求", res);
        });
        let that = this;
        let req = function () {
            return that.HttpRequest.Request("GET", url, reqData).then(res => {
                return res;
            });
        };
        let req2 = req;
        this.HttpRequest.All([req(), req2()]).then(res => {
            console.log("多次请求", res);
        });
        let bigdataR = RepositoryFactory.GetRepositoryInstance(BigData);
        let query = new EsQuery({
            Filter: {
                name: {
                    _match: "贾春丽",
                },
                brandId: "#"
            }
        });
        bigdataR.GetAll(query);
        let e = new BigData();
        e.accountId = "46229303";
        e.brand_name = "火锅打印001";
        e.email = "690531347@qq.com";
        e.name = "画乱了";
        e.sex = "未知";
        bigdataR.Create(e).then(res => {
            console.log("创建返回数据,", res);
        });
        let dsl = new EsQueryDsl({
            Query: {
                and: [
                    {
                        term: {
                            accountId: 46229303
                        }
                    }
                ]
            },
            Size: 40
        });
        bigdataR.GetAllByDsl(dsl);
        console.log("this", this);
    }
    TestMembers() {
        let memberService = this.Service.IMemberService;
        memberService.Login({
            phone: "13524542656",
            password: "a123456"
        }).then((res) => {
            console.log(" ###  1111  ###", res);
        });
        let memberService2 = ApplicationServiceFactory.GetServiceInstance("IMemberService");
        memberService2.Login({
            phone: "13524542656",
            password: "a123456"
        }).then((res) => {
            console.log(" ###  2222  ###", res);
        });
        console.log(this);
    }
    TestProduct() {
        this.Service.IProductService.GetBrandAllProducts({ dataType: 0 }).then((res) => {
            console.log("商品返回数据", res);
        });
    }
}
//# sourceMappingURL=EshineFramework.js.map