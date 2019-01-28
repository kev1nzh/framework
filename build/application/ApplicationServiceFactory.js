import { FrameworkCache } from "../core/cache/Cache";
import { AddCacheDto } from "../core/cache/dtos/AddCacheDto";
import { GetCacheInput } from "../core/cache/dtos/GetCacheInput";
export class ApplicationServiceFactory {
    static RegisterServiceInstance(Service) {
        let service = new Service();
        let serviceKey = service.GetImplementsService();
        let cashKey = "S_" + serviceKey;
        let obj = new AddCacheDto(cashKey, service, 0);
        this.FrameworkCache.AddCache(obj);
        return service;
    }
    static GetServiceInstance(name) {
        let cashKey = "S_" + name;
        let input = new GetCacheInput(cashKey);
        let cacheData = this.FrameworkCache.GetCache(input);
        if (!cacheData) {
            throw new Error("注册中心没有该接口的实现");
        }
        return cacheData;
    }
}
ApplicationServiceFactory.FrameworkCache = FrameworkCache.GetCacheInstance();
//# sourceMappingURL=ApplicationServiceFactory.js.map