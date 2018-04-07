import Router from 'Navigo'
import XHR from './lib/XHR/XHR'
import Sidebar from './components/Sidebar/Sidebar'
import Spinner from './components/Spinner/Spinner'
import IndexedDB from './components/IndexedDB/IndexedDB'
import PopupES from './components/PopupES/PopupES'
import Config from './config/network/network.config'

window.bms=window.bms||{
	deviceInstance:'mobile',
	suppliers:{ selected: {} },
	bidding:{ selected: {} },
	default:{
		routed:[], // executed routers in window
		state:{
			supplier:{},
			account:{},
			product:{},
			bidding: {
				cur: {
					bid: {},
					particulars: {},
					requirements: {},
				},
			},
			proposals: {
				cur: {},
			}
		},

	},
	config: {
		network: new Config().get(),
	 
	},//global functions
	exports:{
		Router,
		XHR,
		Sidebar,
		Spinner,
		IndexedDB,
		PopupES,
	},
	func:{}
}
