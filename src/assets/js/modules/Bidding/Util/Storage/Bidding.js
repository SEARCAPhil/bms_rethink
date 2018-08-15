export default class {
	constructor () {
		this.indexedDB = new window.bms.exports.IndexedDB()
		this.db = 'bidding'
	}

	get (id) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const trans =this.indexedDB.open(this.db)
				const local = trans.get(parseInt(id))
				local.onsuccess = () => { 
					// if contains data
					if (local.result) {
						resolve(local.result)	
					}else{
						reject()	
					}
				}
				local.onerror = (err) => {
					reject(err)
				}
			},100)
		})
	}

	set (data) {
		return new Promise((resolve, reject) => {
			this.get(data.id).then(json => {

				// update if exists
				const trans = this.indexedDB.open(this.db)
				if (json) {
					trans.put(data)
				}else{
					trans.add(data)
				}

				resolve(data)
			})
		})

	}

	delete (id) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {

				const trans = this.indexedDB.open(this.db)
				const local = trans.delete(parseInt(id))

				local.onsuccess = () => { 
					resolve(local.result)
				}
				local.onerror = (err) => {
					reject(err)
				}
				
			},100)	
		})
	}
}