export class RedisDao
{
	connector() { return (<any>this).getDataSource().connector }

	exec(cmd, args, cb) {
		this.connector().exec(cmd, args, cb)
	}

	expire(key, ttl, cb?) {
		if(!cb) return this.connector().expire((<any>this).modelName, key, ttl)
		this.connector().expire((<any>this).modelName, key, ttl).then(result => cb(null, result)).catch(err => cb(err))
		return Promise.resolve()
	}

	get(key, options?, cb?) {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(!cb) return this.connector().get((<any>this).modelName, key)
		this.connector().get((<any>this).modelName, key).then(result => cb(null, result)).catch(err => cb(err))
		return Promise.resolve()
	}

	set(key, payload, options?, cb?) {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(!cb) return this.connector().set((<any>this).modelName, key, payload, options)
		this.connector().set((<any>this).modelName, key, payload, options).then(() => cb()).catch(err => cb(err))
		return Promise.resolve()
	}

	keys(pattern, cb?) {
		if(!cb) return this.connector().keys(pattern)
		this.connector().keys(pattern).then(result => cb(null, result)).catch(err => cb(err))
		return Promise.resolve()
	}

	iterateKeys(pattern) {
		return this.connector().iterateKeys(pattern)
	}

	ttl(key, options?, cb?) {
		if(typeof options === 'function') {
			cb = options
			options = undefined
		}

		if(!cb) return this.connector().ttl((<any>this).modelName, key, options)
		this.connector().ttl((<any>this).modelName, key, options).then(result => cb(null, result)).catch(err => cb(err))
		return Promise.resolve()
	}

	delete(key, cb?) {
		if(!cb) return this.connector().delete((<any>this).modelName, key)
		this.connector().delete((<any>this).modelName, key).then(() => cb()).catch(err => cb(err))
		return Promise.resolve()
	}
}