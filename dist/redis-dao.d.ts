export declare class RedisDao {
    connector(): any;
    exec(cmd: any, args: any, cb: any): void;
    expire(key: any, ttl: any, cb?: any): any;
    get(key: any, options?: any, cb?: any): any;
    set(key: any, payload: any, options?: any, cb?: any): any;
    keys(pattern: any, cb?: any): any;
    iterateKeys(pattern: any): any;
    ttl(key: any, options?: any, cb?: any): any;
    delete(key: any, cb?: any): any;
}
