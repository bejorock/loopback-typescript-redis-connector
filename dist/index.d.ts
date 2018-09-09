import * as connectorCore from 'loopback-connector';
import Connector = connectorCore.Connector;
export declare function initialize(dataSource: any, cb: any): void;
export declare class RedisConnector extends Connector {
    protected settings: any;
    protected dataSource: any;
    DataAccessObject: any;
    private client;
    constructor(settings: any, dataSource: any);
    connect(cb?: any): void;
    disconnect(cb?: any): void;
    ping(cb?: any): void;
    exec(cmd: any, args: any, cb: any): void;
    expire(modelName: any, key: any, ttl: any): any;
    get(modelName: any, key: any, options?: any): any;
    set(modelName: any, key: any, payload: any, options?: any): any;
    keys(pattern: any): any;
    iterateKeys(pattern: any): any;
    ttl(modelName: any, key: any, options?: any): any;
    delete(modelName: any, key: any): any;
    getContext(): any;
    private id(modelName, key);
}
export declare const _Connector: typeof RedisConnector;
