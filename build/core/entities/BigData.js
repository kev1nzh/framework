import { FullAuditEntity } from "./baseEntities/BaseEntity";
export class BigData extends FullAuditEntity {
    constructor() {
        super();
    }
    GetEntityInfo() {
        return {
            Name: "BigData",
            Index: "bigdata",
            Type: "test"
        };
    }
    ;
}
//# sourceMappingURL=BigData.js.map