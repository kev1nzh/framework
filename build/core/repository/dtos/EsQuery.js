export class EsQuery {
    constructor(query) {
        this.filter = query.Filter;
        this.size = query.Size;
        this.groupby = query.GroupBy;
        this.aggs = query.Aggs;
        this.select = query.Select;
    }
}
export class EsQueryDsl {
    constructor(query) {
        this.query = query.Query;
        this.size = query.Size;
        this.aggs = query.Aggs;
        this._source = query.Select;
    }
}
//# sourceMappingURL=EsQuery.js.map