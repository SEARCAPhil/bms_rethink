import ListService from '../../Services/List/List'
import RepService from '../../Services/Reports'
import Highcharts from 'highcharts';

let changeBiddingSummaryDOM = ''

export class Summary {
	constructor () {
		this.XHR = new window.bms.exports.XHR()
        this.ListServ = new ListService()
        this.RepServ = new RepService()
    }
    
    getBiddingSummary (json) {
        return this.RepServ.biddingSummary({
            token: window.localStorage.getItem('token'),
            from: json.from, 
            to: json.to
        })
    }
    
    create (json) {
        return new Promise((resolve, reject) => {
            this.getBiddingSummary(json).then(data => {
                const json = JSON.parse(data)
                this.generate (json)
                resolve(json)
            })
        })
    }

    generate (json) {
        const myChart = Highcharts.chart('container', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: '<b>Bidding Summary Report</b>'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Status',
                colorByPoint: true,
                data: [{
                    name: 'Closed',
                    y: json.closed,
                    sliced: true,
                    selected: true
                }, {
                    name: 'In Progress',
                    y: json.in_progress
                }, {
                    name: 'In Review',
                    y: json.in_review
                }, {
                    name: 'Failed',
                    y: json.failed
                }]
            }]
        });
        
    
    }
    changeDate () {
        // close modal
        document.getElementById('bidding-modal').close()
        // fields
        const from = document.getElementById('date-from-field')
        const to = document.getElementById('date-to-field')

        if (from.value.length && to.value.length) {
            // render new graph
            this.create({
                from: from.value,
                to: to.value,
            }).then(json => {
                changeBiddingSummaryDOM = new CustomEvent('changeBiddingSummaryDOM', {
                    detail: json
                })
                window.dispatchEvent(changeBiddingSummaryDOM)
            })
        } 

        
    }

    loadChangeDate (e) {
		const URL='pages/bidding/modal/change_date.html'
		const id=e.target.id
		const proto = Object.assign({ __proto__: this.__proto__ }, this)

		return this.XHR.request({method:'GET',url:URL}).then(res=>{
			let modalTarget=document.getElementById('modal-bidding-body')
			modalTarget.innerHTML=res

			setTimeout(()=>{
				window.bms.default.scriptLoader(modalTarget)
			},50)

			setTimeout(()=>{
				//remove cancel
				document.getElementById('modal-dialog-close-button').addEventListener('click',()=>{
		
					document.getElementById('bidding-modal').close()
					
				})

				let btn = document.getElementById('modal-dialog-send-button')
				btn.el =  e.target
				btn.addEventListener('click', this.changeDate.bind(proto))
			})
		}).catch(e=>{})
	}
    bindChangeDate () {
		const proto = Object.assign({ __proto__: this.__proto__ }, this)
		document.querySelectorAll('.change-date-modal-btn').forEach((val, index) => {
			val.addEventListener('click',this.loadChangeDate.bind(proto))
		})
	}

       
}

// change DOM
const changeGraphDisplay = (json) => {
    const analysis = document.getElementById('analysis-section')
    // date
    if (json.from) {
        const from = document.getElementById('from-section') 
        const to = document.getElementById('to-section')   

        from.textContent = json.from
        to.textContent = json.to

        const targ = document.getElementById('print-pdf-href')
        targ.href = `${window.bms.config.network}/bidding/reports/bidding_summary.php?from=${json.from}&to=${json.to}`
        targ.target = `_blank`
        // remove prevent default
        targ.setAttribute('onclick', '')
    }
    // total
    if (json.total) {
        const total = document.getElementById('total-count-section')
        total.textContent = json.total
    }
    // get detailed values
    if (json.breakdown) {
        const norm = document.getElementById('normal-count-section')
        const exe = document.getElementById('exempted-count-section')
        // change
        norm.textContent = json.breakdown.normal
        exe.textContent = json.breakdown.exempted
    }

    analysis.innerHTML = ''
    json.analysis.forEach((val, index) => {
        let classA = ''
        if (val.severity == 'warning') classA = "text-warning"
        if (val.severity == 'severe') classA = "text-danger"

        analysis.innerHTML+=`
            <p> <span class="${classA}">[${val.severity}]</span> ${val.message}</p>
        `
    })
}

// Initialize
const Sum = new Summary()
// change date option
Sum.bindChangeDate()
// get data from remote server

Sum.create({
    from: '2018-04-01',
    to: '2018-05-31',
 })
 .then(json => {
    changeBiddingSummaryDOM = new CustomEvent('changeBiddingSummaryDOM', {
       detail: json
   }) 
   window.dispatchEvent(changeBiddingSummaryDOM)
})

window.addEventListener('changeBiddingSummaryDOM', (e) => {
    changeGraphDisplay(e.detail) 
})