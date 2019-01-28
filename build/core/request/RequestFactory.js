export class AxiosRequest {
    constructor(axios) {
        this._axios = axios;
    }
    Request(method, url, data) {
        return this._axios({ method: method, url: url, data: data }).then((res) => {
            console.log("----- Axios返回数据 -----", res);
            return Promise.resolve(res.data);
        }, (err) => {
            return Promise.reject(err);
        });
    }
    All(promise) {
        return this._axios.all(promise);
    }
}
export class XmlHttpRequest {
    Request(method, url, data) {
        return Promise.resolve(null);
    }
    All(promise) {
        throw new Error("没有实现!");
    }
}
//# sourceMappingURL=RequestFactory.js.map