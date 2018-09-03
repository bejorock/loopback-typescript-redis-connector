import { DataSource } from 'loopback-datasource-juggler'
import { Observable } from 'rxjs';

describe("loopback-redis-connector", () => {
	let model
	let ds

	beforeEach(async() => {
		ds = new DataSource({
			connector: require('../src/main/index'),
			name: "redisDb",
			host: "127.0.0.1",
			port: 6379,
			prefix: "connector:redis:test:"
		})

		model = ds.define('AccessToken', {})
	})

	it("should set and get a value", async () => {
		await model.set("name", "rana loda tama")
		let name = await model.get("name")
		
		expect(name).toBe("rana loda tama")
	}) 

	it("should set, expire and ttl a value", async () => {
		await model.set("name", "rana loda tama")
		await model.expire("name", 10000)
		let ttl = await model.ttl("name")

		expect(ttl).toBe(10000)
	})

	it("should set, delete and get a value", async () => {
		await model.set("name", "rana loda tama")
		await model.delete("name")
		let name = await model.get("name")

		expect(name).toBeUndefined()
	})

	it("should set a value and read keys", async () => {
		await model.set("name", "rana loda tama")
		let keys = await model.keys("*")

		expect(keys).toEqual(["connector:redis:test:AccessToken:name"])
	})

	it("should set a value and iterate keys", async () => {
		await model.set("name", "rana loda tama")
		let observer:Observable<any> = await model.iterateKeys("*")

		observer.forEach(key => expect(key).toEqual("connector:redis:test:AccessToken:name"))
	})
})