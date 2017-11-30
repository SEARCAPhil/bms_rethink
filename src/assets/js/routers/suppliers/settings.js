const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
import Categories from '../../modules/Suppliers/Components/Products/Categories/Categories.js'
import CatTemplate from '../../modules/Suppliers/Templates/Products/Categories/Categories.js'

let Cat=new Categories()

const loadSettingsSection=()=>{ 
	return new Promise((resolve,reject)=>{
		var html=`<section class="profile-tabs profile-tabs-about">
			<div class="profile-section">
				<h5><i class="material-icons md-18">settings</i> Settings</h5>
				<hr/>
				<div class="settings-container">
					<div class="settings-update-section"></div>
					<div class="settings-block-section"></div>
					<div class="settings-delete-section"></div>
				</div>
			</div>
		</section>`

		let el=document.querySelector('route[name="/suppliers/settings"]')
		el.innerHTML=html

		resolve(el)
	})
}

const loadUpdateSec=()=>{
	let el=document.querySelector('.settings-update-section')
	var htm=`
		<div>
			<h5>Update</h5>
			<p class="text-secondary"><i class="material-icons md-18">update</i> Update company information</p>
			<p><button type="button" class="btn btn-sm btn-secondary">UPDATE</button></p>
			<hr/>
		</div>
	`
	el.innerHTML=htm
	el.style.display="block"
}

const loadBlockSec=()=>{
	let el=document.querySelector('.settings-block-section')
	var htm=`
		<div>
			<h5 class="text-danger">Block</h5>
			<p class="text-danger">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
			</p>
			<p><button type="button" class="btn btn-sm btn-danger">BLOCK</button></p>
			<hr/>
		</div>
	`
	el.innerHTML=htm
	el.style.display="block"
}


const loadDeleteSec=()=>{
	let el=document.querySelector('.settings-delete-section')
	var htm=`
		<div>
			<h5 class="text-danger">Delete</h5>
			<div class="col" style="background:#e13d34;color:#fff;padding:10px;">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
				</p>
				<p><button type="button" class="btn btn-sm btn-light">DELETE</button></p>
			</div>
		</div>
	`
	el.innerHTML=htm
	el.style.display="block"
}


appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/settings':(params)=>{ 
		

		window.bms.default.changeDisplay(['route[name="/suppliers/settings"]'],'block')
		window.bms.default.changeDisplay(['route[name="/suppliers/products"]','route[name="/suppliers/about"]'],'none')

		loadSettingsSection().then(()=>{
			loadUpdateSec()
			loadBlockSec()
			loadDeleteSec()
		})
	}
}).resolve()

