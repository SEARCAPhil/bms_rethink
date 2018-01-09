const appRoute=new window.bms.exports.Router('http://localhost/bms_rethink/www/',true)
import LogClass from '../../modules/Suppliers/Components/Logs/Logs.js'
import LogTemplate from '../../modules/Suppliers/Templates/Logs/Logs.js'

let PopupInstance
let Logs = new LogClass()
let LogTemp = new LogTemplate() 

const showMore=(id,page)=>{
	let el=document.createElement('p')
	el.innerHTML='<center>Show more</center>'

	el.addEventListener('click',function(){
		window.bms.default.spinner.show()	
		this.remove()

		//proceed to next page
		getLogs(id,page)
	})
	return el
}

const getLogs=(id,page=1)=>{
	Logs.lists(id,page||1).then(json=>{

			let data=JSON.parse(json)
			let parsedData=data.data||[]
			let target=document.querySelector('[name="/suppliers/logs"]')

			//hide spinner
			window.bms.default.spinner.hide()	

			//clear section
			if(parsedData.length>0)	target.innerHTML=''

			//if no data
			if(parsedData.length<1){
				target.innerHTML=`
					<center style="margin-top:70px;">
						<hr/>
						<i class="material-icons md-48">history</i>
						<h5 class="text-muted">No event has been recorded</h5>
						<small><p>View all actions across accounts under your company</p></small>
					</center>
				`
			}

			for(let x=0;x<parsedData.length;x++){
				target.appendChild(LogTemp.render({id:parsedData[x].id,username:parsedData[x].username,description:parsedData[x].message,event:parsedData[x].event,date:parsedData[x].date_created}))

				//show more if exactly 30 item starting from 0
				if(parsedData.length==29){
					target.append(showMore(id,page+1))
				}
			}
		})

}

appRoute.on({
 	'/*':()=>{
 		//required
 	},
	'/suppliers/:id/logs':(params)=>{ 
		
		window.bms.default.changeDisplay(['route[name="/suppliers/logs"]'],'block')
		window.bms.default.changeDisplay(['route[name="/suppliers/products"]','route[name="/suppliers/about"]','route[name="/suppliers/settings"]','route[name="/suppliers/accounts"]'],'none')

		getLogs(params.id,params.page)
	}
}).resolve()

