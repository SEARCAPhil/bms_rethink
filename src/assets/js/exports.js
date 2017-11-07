import Router from 'Navigo'
import XHR from './lib/XHR/XHR'
import Spinner from './components/Spinner/Spinner'

window.bms=window.bms||{
	deviceInstance:'mobile',
	suppliers:{selected:{}},
	default:{}, //global functions
	exports:{
		Router,
		XHR,
		Spinner
	}
}
