import Router from 'Navigo'
import XHR from './lib/XHR/XHR'
import Sidebar from './components/Sidebar/Sidebar'
import Spinner from './components/Spinner/Spinner'

window.bms=window.bms||{
	deviceInstance:'mobile',
	suppliers:{selected:{}},
	default:{
		routed:[], // executed routers in window
		state:{
			supplier:{}
		}
	}, //global functions
	exports:{
		Router,
		XHR,
		Sidebar,
		Spinner
	},
	func:{}
}
