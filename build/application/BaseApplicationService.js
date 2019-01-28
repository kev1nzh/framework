import { ConfigCenter } from "../core/config/ConfigCenter";
export class BaseApplicationService {
    constructor() {
        this.ConfigCenter = ConfigCenter.GetInstance();
        this.Cache = this.ConfigCenter.GetCacheInstance();
        this.Request = this.ConfigCenter.GetRequestInstance();
        this.GlobalUrl = this.ConfigCenter.GetGlobalUrl();
    }
    GetLoginMemberInfo() {
        return this.ConfigCenter.GetSysInfo();
    }
    GetBrandInfo() {
        return this.ConfigCenter.GetBrandInfo();
    }
    GetStoreInfo() {
        return this.ConfigCenter.GetStoreInfo();
    }
    ImplementsIApplicationService() {
        return true;
    }
}
//# sourceMappingURL=BaseApplicationService.js.map