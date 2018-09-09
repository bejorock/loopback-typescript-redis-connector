import Redis from 'ioredis'
import { RedisDao } from './redis-dao';
import * as connectorCore from 'loopback-connector';
import { Observable } from 'rxjs'
import * as _ from 'lodash'

import Connector = connectorCore.Connector
const Dao:any = function() {}

Object.getOwnPropertyNames(RedisDao.prototype).forEach(name => {
	Dao[name] = RedisDao.prototype[name]
});

export function initialize(dataSource, cb) {
	const settings = dataSource.settings

	dataSource.connector = new RedisConnector(settings, dataSource);

	dataSource.connector.connect(cb)
}

export class RedisConnector extends Connector {
	
	DataAccessObject = Dao

	private client
	
	constructor(protected settings, protected dataSource) {
		super()
		Connector.call(this, 'redis-connector', settings)

		this.client = new Redis(Object.assign({}, settings, {lazyConnect: true, keyPrefix: settings.prefix}));
	}

	connect(cb?) {
		this.client.connect(cb)
	}

	disconnect(cb?) {
		this.client.quit(cb)
	}

	ping(cb?) {
		this.client.ping(cb)
	}

	exec(cmd, args, cb) {
		const redCmd = new Redis.Command(cmd, args, 'utf-8', (err, result) => {
			cb(err, result)
		})

		this.client.sendCommand(redCmd)
	}

	expire(modelName, key, ttl) {
		const id = this.id(modelName, key)
		return this.client.expire(id, ttl)
	}

	get(modelName, key, options?) {
		const id = this.id(modelName, key)
		return this.client.hgetall(id).then(data => {
			try { return JSON.parse(data.dump) }
			catch(e) { return data.dump }
		})
	}

	set(modelName, key, payload, options?) {
		options = options || {}
		const id = this.id(modelName, key)
		const multi = this.client.multi()

		multi.hmset(id, { dump: (typeof payload === 'object' ? JSON.stringify(payload) : payload) })

		if(options.ttl) multi.expire(id, options.ttl)

		return multi.exec()
	}

	keys(pattern) {
		return this.client.keys(pattern)
	}

	iterateKeys(pattern) {
		return Observable.create(observer => {
			let stream = this.client.scanStream({
				match: pattern,
				count: 10
			})

			stream.on('data', (resultKeys) => {
				for(let i=0; i<resultKeys.length; i++)
					observer.next(resultKeys[i])
			})

			stream.on('end', () => {
				observer.complete()
			})

			return () => {}
		})
	}

	ttl(modelName, key, options?) {
		options = options || {}
		const id = this.id(modelName, key)
		return this.client.ttl(id)
	}

	delete(modelName, key) {
		const id = this.id(modelName, key)
		return this.client.del(id)
	}

	getContext() { return this.client }

	private id(modelName, key) { 
		if(modelName === 'RedisKv')
			return key
		return `${modelName}:${key}` 
	}
}

export const _Connector = RedisConnector