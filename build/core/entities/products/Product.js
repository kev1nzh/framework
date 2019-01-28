import { FullAuditEntity } from "../baseEntities/BaseEntity";
class ProductBase {
    constructor() {
        this.name = undefined;
        this.alias = undefined;
        this.intro = undefined;
        this.pinyin = undefined;
        this.kitchen = undefined;
        this.unit = undefined;
        this.category = undefined;
        this.options = undefined;
        this.picInfo = undefined;
        this.components = undefined;
        this.scales = undefined;
        this.tags = undefined;
        this.salesTime = undefined;
    }
}
export class Product extends FullAuditEntity {
    constructor() {
        super();
        this.type = undefined;
        this.allStore = undefined;
        this.brand_name = undefined;
        this.base = new ProductBase();
        this.isExtra = undefined;
        this.operateperson = undefined;
        this.storeIds = undefined;
    }
    GetEntityInfo() {
        return {
            Name: "Product",
            Index: "ebossh",
            Type: "products"
        };
    }
    ;
}
//# sourceMappingURL=Product.js.map