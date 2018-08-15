import ListComp from '../../../../modules/Suppliers/Components/List/List.js'
import ListTemplate from '../../../../modules/Suppliers/Templates/List/List.js'

let List=new ListTemplate()
let ListC=new ListComp()

export default class{
	loadSuppliersSection(){
		return new Promise((resolve,reject)=>{
			let targ=document.querySelector('div[name="/suppliers"]')
			let html=`
				<article class="row list-container">
					<!--list-->
				    <section class="col-md-12 col-lg-12 float-left list-sidebar" style="background:#fff;box-shadow:0 0 5px rgba(200,200,200,.7);min-height: 100vh">     
						<section style="margin-top:55px;">
							<div class="row">
								<span class="search-list-section-icon col-lg-1"><i class="material-icons">search</i></span>
								<span class="search-list-section col-lg-10"><input class="form-control" type="text" style="padding:4px;border:none;background:#fcfcfc;" placeholder="Search"></span>
							</div>
							<br/>
						</section>
						<section>
							<div class="col col-md-12" data-role="none" style="margin-bottom: 5px;">
				                <span class="menuList allNav"><a href="#/suppliers/all">All</a></span>&emsp;
				                <span class="menuList blockedNav"><a href="#/suppliers/blocked">Blocked</a></span>&emsp;
				                <span class="menuList suppliers_new_button"><a href="#/suppliers/forms/registration/">New<i class="material-icons md-18">add</i></a></span>

				                <br> 
				           	</div>
						</section>	
						<section>
							<!--list-->
							<div class="row list-section"></div>
						</section>	
				    </section>
				    <!--/list-->
					<link rel="preload" href="./assets/css/modules/suppliers/list.css" as="style" onload="this.rel='stylesheet'">    
				</article>
			`

			
			targ.innerHTML=html
			resolve(html)
		})
	}

	loadAllSuppliers(){

		return new Promise((resolve,reject)=>{
			document.querySelector('.allNav').classList.add('active')
			document.querySelector('.blockedNav').classList.remove('active')

			//clear list
			//document.querySelector('.list-section').innerHTML=''
			//fetch via AJAX
			ListC.getList().then((data)=>{
				var parsedData=JSON.parse(data)
				var json=parsedData.data
				for(let x=0; x<json.length; x++){
					document.querySelector('.list-section').appendChild(List.render({id:json[x].id,name:json[x].name,description:json[x].description,tagline:json[x].tagline,class:'col-xs-12 col-md-12 col-sm-12 list',established:json[x].established}))
				}

				window.bms.default.spinner.hide()

				//autoclick
				if(json[0]){
					//document.querySelector('.list').children[0].click()
					//set state as loaded
					window.bms.default.state.supplier.isLoaded=1
				}	
			})

			resolve(window)
		})
	}
}
