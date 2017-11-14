import Router from 'Navigo'
import XHR from './lib/XHR/XHR'
import AppRoute from './lib/AppRoute/AppRoute'
import Spinner from './components/Spinner/Spinner'
import Sidebar from './components/Sidebar/Sidebar'

window.bms=window.bms||{
	deviceInstance:'mobile',
	suppliers:{selected:{}},
	default:{
		routed:[] // executed routers in window
	}, //global functions
	exports:{
		Router,
		AppRoute,
		XHR,
		Spinner,
		Sidebar
	}
}
