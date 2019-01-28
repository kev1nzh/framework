import { AddCacheDto } from './dtos/AddCacheDto';
import { UpdateCacheDto } from './dtos/UpdateCacheDto';
class BaseCache {
    constructor() { this.Cache = {}; }
    CheckEmptyKey(key) {
        if (key == '')
            return true;
        return false;
    }
    CheckCacheKey(key) {
        if (this.Cache[key])
            return true;
        else
            return false;
    }
    CheckDeadLine(key) {
        let obj = this.Cache[key];
        let now = new Date().getTime();
        if (obj) {
            if (obj.timeSpan == 0)
                return false;
            else if (!obj.data || obj.deadline <= now)
                return true;
            else
                return false;
        }
        return false;
    }
}
class CacheInstance {
    constructor(key, data, timeSpan) {
        this.timeSpan = 1000 * 60 * 5;
        this.key = key;
        this.data = data;
        if (timeSpan || timeSpan == 0) {
            this.timeSpan = timeSpan;
        }
        let now = new Date().getTime();
        this.deadline = now + this.timeSpan;
    }
}
export class FrameworkCache extends BaseCache {
    static GetCacheInstance() {
        if (!this._cacheInstance)
            this._cacheInstance = new FrameworkCache();
        return this._cacheInstance;
    }
    constructor() { super(); }
    AddCache(data) {
        if (this.CheckEmptyKey(data.key) && this.CheckCacheKey(data.key)) {
            console.error("该缓存Key已存在，请使用唯一缓存Key!");
            return false;
        }
        let obj = new CacheInstance(data.key, data.data, data.timeSpan);
        this.Cache[data.key] = obj;
        return true;
    }
    UpdateCache(data) {
        if (this.CheckEmptyKey(data.key)) {
            console.error("Key为空,请检查!");
            return false;
        }
        if (!this.CheckCacheKey(data.key)) {
            console.error("不存在该缓存Key，请确认Key值正确");
            return false;
        }
        let obj = this.Cache[data.key];
        if (obj) {
            this.Cache[data.key].data = data.data;
            let now = new Date().getTime();
            this.Cache[data.key].deadline = now + obj.timeSpan;
        }
        else
            return false;
        return true;
    }
    GetCache(input) {
        if (this.CheckEmptyKey(input.key)) {
            console.error("缓存Key为空");
            return null;
        }
        if (!this.CheckCacheKey(input.key)) {
            let addCacheDto = new AddCacheDto(input.key, null);
            this.AddCache(addCacheDto);
        }
        let cacheData = this.Cache[input.key].data;
        if (this.CheckDeadLine(input.key)) {
            if (input.callBack) {
                return input.callBack(input.param).then((res) => {
                    let updateDto = new UpdateCacheDto(input.key, res);
                    this.UpdateCache(updateDto);
                    return res;
                });
            }
            return null;
        }
        return cacheData;
    }
    GetCacheAsync(input) {
        if (this.CheckEmptyKey(input.key)) {
            console.error("缓存Key为空");
            return Promise.resolve(null);
        }
        if (!this.CheckCacheKey(input.key)) {
            let addCacheDto = new AddCacheDto(input.key, null);
            this.AddCache(addCacheDto);
        }
        let cacheData = this.Cache[input.key].data;
        if (this.CheckDeadLine(input.key)) {
            console.log("===  缓存过期  ===");
            if (input.callBack) {
                return input.callBack(input.param).then((res) => {
                    let updateDto = new UpdateCacheDto(input.key, res);
                    this.UpdateCache(updateDto);
                    return res;
                });
            }
            return Promise.resolve(null);
        }
        console.log("===  缓存未过期  ===");
        return Promise.resolve(cacheData);
    }
    RemoveCache(key) {
        if (!this.CheckCacheKey(key)) {
            console.error("Key值不存在，请检查.");
            return false;
        }
        delete this.Cache[key];
        return true;
    }
}
export class MemoryCache extends BaseCache {
    static GetCacheInstance() {
        if (!this._cacheInstance)
            this._cacheInstance = new MemoryCache();
        return this._cacheInstance;
    }
    constructor() { super(); }
    AddCache(data) {
        if (this.CheckEmptyKey(data.key) && this.CheckCacheKey(data.key)) {
            console.error("该缓存Key已存在，请使用唯一缓存Key!");
            return false;
        }
        let obj = new CacheInstance(data.key, data.data, data.timeSpan);
        this.Cache[data.key] = obj;
        return true;
    }
    UpdateCache(data) {
        if (this.CheckEmptyKey(data.key)) {
            console.error("Key为空,请检查!");
            return false;
        }
        if (!this.CheckCacheKey(data.key)) {
            console.error("不存在该缓存Key，请确认Key值正确");
            return false;
        }
        let obj = this.Cache[data.key];
        if (obj) {
            this.Cache[data.key].data = data.data;
            let now = new Date().getTime();
            this.Cache[data.key].deadline = now + obj.timeSpan;
        }
        else
            return false;
        return true;
    }
    GetCache(input) {
        if (this.CheckEmptyKey(input.key)) {
            console.error("缓存Key为空");
            return null;
        }
        if (!this.CheckCacheKey(input.key)) {
            let addCacheDto = new AddCacheDto(input.key, null);
            this.AddCache(addCacheDto);
        }
        let cacheData = this.Cache[input.key].data;
        if (this.CheckDeadLine(input.key)) {
            if (input.callBack) {
                return input.callBack(input.param).then((res) => {
                    let updateDto = new UpdateCacheDto(input.key, res);
                    this.UpdateCache(updateDto);
                    return res;
                });
            }
            return null;
        }
        return cacheData;
    }
    GetCacheAsync(input) {
        if (this.CheckEmptyKey(input.key)) {
            console.error("缓存Key为空");
            return Promise.resolve(null);
        }
        if (!this.CheckCacheKey(input.key)) {
            let addCacheDto = new AddCacheDto(input.key, null);
            this.AddCache(addCacheDto);
        }
        let cacheData = this.Cache[input.key].data;
        if (this.CheckDeadLine(input.key)) {
            if (input.callBack) {
                return input.callBack(input.param).then((res) => {
                    let updateDto = new UpdateCacheDto(input.key, res);
                    this.UpdateCache(updateDto);
                    return res;
                });
            }
            return Promise.resolve(null);
        }
        return cacheData;
    }
    RemoveCache(key) {
        if (!this.CheckCacheKey(key)) {
            console.error("Key值不存在，请检查.");
            return false;
        }
        delete this.Cache[key];
        return true;
    }
}
//# sourceMappingURL=Cache.js.map