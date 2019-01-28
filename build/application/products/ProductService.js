import { BaseApplicationService } from "../BaseApplicationService";
import { Product } from "../../core/entities/products/Product";
import { EsQuery } from "../../core/repository/dtos/EsQuery";
import { RepositoryFactory } from "../../core/repository/RepositoryFactory";
import { GetCacheInput } from "../../core/cache/dtos/GetCacheInput";
export class ProductService extends BaseApplicationService {
    constructor() {
        super();
        this.AllProducts_Map_CacheKey = "AllProducts_Map";
        this.AllProducts_List_CacheKey = "AllProducts_List";
        this.CanSaleProducts_Map_CacheKey = "CanSaleProducts_Map";
        this.CanSaleProducts_List_CacheKey = "CanSaleProducts_List";
        this._rProduct = RepositoryFactory.GetRepositoryInstance(Product);
    }
    GetBrandAllProducts(data) {
        let query = new EsQuery({
            Filter: {
                storeId: "all",
                type: ["product", "zixuan", "taocan"],
                brandId: "#"
            },
            Size: 1000
        });
        let cacheKey = data.dataType && data.dataType == 1 ? this.AllProducts_List_CacheKey : this.AllProducts_Map_CacheKey;
        let that = this;
        let getCacheInput = new GetCacheInput(cacheKey, function (dataType) {
            return that._rProduct.GetAll(query).then((res) => {
                console.log("商品返回数据", res);
                if (!dataType || dataType == 0) {
                    let dataLen = res.data.length;
                    let productMap = {};
                    if (dataLen > 0) {
                        for (let index = 0; index < dataLen; index++) {
                            const element = res.data[index];
                            productMap[element.id] = element;
                        }
                    }
                    return productMap;
                }
                return res.data;
            });
        }, data.dataType);
        return this.Cache.GetCacheAsync(getCacheInput);
    }
    GetStoreProducts(data) {
        throw new Error("Method not implemented.");
    }
    GetImplementsService() {
        return "IProductService";
    }
}
//# sourceMappingURL=ProductService.js.map