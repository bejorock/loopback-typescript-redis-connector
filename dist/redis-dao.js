"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RedisDao {
    connector() { return this.getDataSource().connector; }
    exec(cmd, args, cb) {
        this.connector().exec(cmd, args, cb);
    }
    expire(key, ttl, cb) {
        if (!cb)
            return this.connector().expire(this.modelName, key, ttl);
        this.connector().expire(this.modelName, key, ttl).then(result => cb(null, result)).catch(err => cb(err));
        return Promise.resolve();
    }
    get(key, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (!cb)
            return this.connector().get(this.modelName, key);
        this.connector().get(this.modelName, key).then(result => cb(null, result)).catch(err => cb(err));
        return Promise.resolve();
    }
    set(key, payload, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (!cb)
            return this.connector().set(this.modelName, key, payload, options);
        this.connector().set(this.modelName, key, payload, options).then(() => cb()).catch(err => cb(err));
        return Promise.resolve();
    }
    keys(pattern, cb) {
        if (!cb)
            return this.connector().keys(pattern);
        this.connector().keys(pattern).then(result => cb(null, result)).catch(err => cb(err));
        return Promise.resolve();
    }
    iterateKeys(pattern) {
        return this.connector().iterateKeys(pattern);
    }
    ttl(key, options, cb) {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }
        if (!cb)
            return this.connector().ttl(this.modelName, key, options);
        this.connector().ttl(this.modelName, key, options).then(result => cb(null, result)).catch(err => cb(err));
        return Promise.resolve();
    }
    delete(key, cb) {
        if (!cb)
            return this.connector().delete(this.modelName, key);
        this.connector().delete(this.modelName, key).then(() => cb()).catch(err => cb(err));
        return Promise.resolve();
    }
}
exports.RedisDao = RedisDao;
//# sourceMappingURL=redis-dao.js.map