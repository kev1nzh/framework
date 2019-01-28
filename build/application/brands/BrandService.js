import { BaseApplicationService } from "../BaseApplicationService";
export class BrandService extends BaseApplicationService {
    constructor() {
        super(...arguments);
        this._urls = {
            StoreList: 'IBrands/storeList',
        };
    }
    GetFullUrl(url) {
        return this.GlobalUrl.CloudStoreApi + url;
    }
    GetImplementsService() {
        return "IBrandService";
    }
    GetBrandStores() {
        let url = this.GetFullUrl(this._urls.StoreList);
        return this.Request.Request("POST", url, {
            p: {
                brandId: '100224'
            }
        }).then((res) => {
            return res;
        });
    }
}
//# sourceMappingURL=BrandService.js.map