export class BaseEntity {
    constructor() {
        this.id = undefined;
        this._id = undefined;
    }
    ImplementsIBrand() {
        return true;
    }
    CheckImplements(interfaceName) {
        let implementsKey = "Implements" + interfaceName;
        let obj = this;
        let func = obj[implementsKey];
        if (func && func())
            return true;
        return false;
    }
}
export class FullAuditEntity extends BaseEntity {
    constructor() {
        super();
    }
    ImplementsIBrand() {
        return true;
    }
    ImplementsIStore() {
        return true;
    }
    ImplementsIHasCreationTime() {
        return true;
    }
    ImplementsIHasCreationMember() {
        return true;
    }
    ImplementsIHasModificationTime() {
        return true;
    }
    ImplementsIHasModificationMember() {
        return true;
    }
}
//# sourceMappingURL=BaseEntity.js.map