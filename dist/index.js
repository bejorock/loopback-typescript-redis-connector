"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redis_dao_1 = require("./redis-dao");
const connectorCore = __importStar(require("loopback-connector"));
const rxjs_1 = require("rxjs");
var Connector = connectorCore.Connector;
const Dao = function () { };
Object.getOwnPropertyNames(redis_dao_1.RedisDao.prototype).forEach(name => {
    Dao[name] = redis_dao_1.RedisDao.prototype[name];
});
function initialize(dataSource, cb) {
    const settings = dataSource.settings;
    dataSource.connector = new RedisConnector(settings, dataSource);
    dataSource.connector.connect(cb);
}
exports.initialize = initialize;
class RedisConnector extends Connector {
    constructor(settings, dataSource) {
        super();
        this.settings = settings;
        this.dataSource = dataSource;
        this.DataAccessObject = Dao;
        Connector.call(this, 'redis-connector', settings);
        this.client = new ioredis_1.default(Object.assign({}, settings, { lazyConnect: true, keyPrefix: settings.prefix }));
    }
    connect(cb) {
        this.client.connect(cb);
    }
    disconnect(cb) {
        this.client.quit(cb);
    }
    ping(cb) {
        this.client.ping(cb);
    }
    exec(cmd, args, cb) {
        const redCmd = new ioredis_1.default.Command(cmd, args, 'utf-8', (err, result) => {
            cb(err, result);
        });
        this.client.sendCommand(redCmd);
    }
    expire(modelName, key, ttl) {
        const id = this.id(modelName, key);
        return this.client.expire(id, ttl);
    }
    get(modelName, key, options) {
        const id = this.id(modelName, key);
        return this.client.hgetall(id).then(data => {
            try {
                return JSON.parse(data.dump);
            }
            catch (e) {
                return data.dump;
            }
        });
    }
    set(modelName, key, payload, options) {
        options = options || {};
        const id = this.id(modelName, key);
        const multi = this.client.multi();
        multi.hmset(id, { dump: (typeof payload === 'object' ? JSON.stringify(payload) : payload) });
        if (options.ttl)
            multi.expire(id, options.ttl);
        return multi.exec();
    }
    keys(pattern) {
        return this.client.keys(pattern);
    }
    iterateKeys(pattern) {
        return rxjs_1.Observable.create(observer => {
            let stream = this.client.scanStream({
                match: pattern,
                count: 10
            });
            stream.on('data', (resultKeys) => {
                for (let i = 0; i < resultKeys.length; i++)
                    observer.next(resultKeys[i]);
            });
            stream.on('end', () => {
                observer.complete();
            });
            return () => { };
        });
    }
    ttl(modelName, key, options) {
        options = options || {};
        const id = this.id(modelName, key);
        return this.client.ttl(id);
    }
    delete(modelName, key) {
        const id = this.id(modelName, key);
        return this.client.del(id);
    }
    getContext() { return this.client; }
    id(modelName, key) {
        if (modelName === 'RedisKv')
            return key;
        return `${modelName}:${key}`;
    }
}
exports.RedisConnector = RedisConnector;
exports._Connector = RedisConnector;
//# sourceMappingURL=index.js.map