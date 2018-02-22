export default class {
	constructor () {
		this.dbInstance
		this.idb = window.indexedDB.open('bms',1)
		this.idb.onsuccess= (e) => {
			this.dbInstance = e.target.result
		}
		this.idb.onupgradeneeded = (e) => {
			// database table
			this.dbInstance = e.target.result
			this.createTable('particulars',{keyPath:'id'}).then((store) => {
				store.createIndex('bid', 'bidding_id')
			})
			this.createTable('requirements',{keyPath:'id'}).then((store) => {
				store.createIndex('particular_id', 'particular_id')
			})
			this.createTable('bidding',{keyPath:'id'}).then((store) => {
				store.createIndex('status', 'status')
			})

		}

		this.idb.onerror = (e) => {
			console.log(e.target)
		}

		return this
	}
	
	createTable ( name, opt = {}) {
		return new Promise((resolve, reject) => {
			if(!this.dbInstance.objectStoreNames.contains(name)){
				const objStore = this.dbInstance.createObjectStore(name, opt)
				resolve(objStore)
			}
		})

	}
	open (table, opt = 'readwrite') {
		return this.dbInstance.transaction(table, opt).objectStore(table)
	}


}