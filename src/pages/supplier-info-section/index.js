import style from './style'

export default class {
  constructor (params) {
    this.__opt = params
  }

  __about () {
    const __targ = this.template.querySelector('suppliers-section-container')
    const __temp = document.createElement('section')
    __temp.classList.add('col', 'col-lg-10', 'offset-lg-1')
    __temp.innerHTML = `
    <h3><b>AMTI</b></h3>
    <p>Accent Micro Technologies Inc.<br/>
      <span class="text-muted"><i class="material-icons">location_on</i> Chino Roces Ave. Makati City</span>
    </p><hr/>
    <br/>
    <p class="text-justify">
      
      Where does it come from?<br/>
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. <br/>
      Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, <br/>
      and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of <br/>
      "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular <br/>
      during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
      <br/>
      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"<br/> 
      by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

      Where does it come from?<br/>
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. <br/>
      Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, <br/>
      and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of <br/>
      "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular <br/>
      during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
      <br/>
      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"<br/> 
      by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
      <br/><br/>
      Where does it come from?<br/>
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. <br/>
      Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, <br/>
      and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of <br/>
      "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular <br/>
      during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
      <br/>
      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"<br/> 
      by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
    </p>`

    __targ.innerHTML = ''
    __targ.append(__temp)
  }


  __accounts () {
    const __targ = this.template.querySelector('suppliers-section-container')
    const __temp = document.createElement('section')
    __temp.classList.add('col', 'col-lg-10', 'offset-lg-1')
    __temp.innerHTML = `
        <section>
          <input type="text" class="form-control" placeholder="Search" data-role="none" id="search-account-input"/>
        </section><br/><br/>

        <h5>Total Records: 150</h5>
        <p><a href="#" class="text-danger">Add New <i class="material-icons">add_circle</i></a></p>

        <table class="table suppliers-table">
          <thead>
            <th></th>
            <th>#ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Department Alias</th>
            <th>Position</th>
            <th>Status</th>
          </thead>
          <tbody>
            <tr>
              <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
              <td><a href="#/suppliers//info">150</a></td>
              <td style="max-width:200px"><a href="#/suppliers//info">John Mark Doe</a></td>
              <td>jmd@remote.org</td>
              <td>Information Technology Department</td>
              <td>ITD</td>
              <td>Programmer</td>
              <td>Active</td>
            </tr>
            <tr>
              <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
              <td><a href="#/suppliers//info">150</a></td>
              <td style="max-width:200px"><a href="#/suppliers//info">John Mark Doe</a></td>
              <td>jmd@remote.org</td>
              <td>Information Technology Department</td>
              <td>ITD</td>
              <td>Programmer</td>
              <td>Active</td>
            </tr>
            <tr>
              <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
              <td><a href="#/suppliers//info">150</a></td>
              <td style="max-width:200px"><a href="#/suppliers//info">John Mark Doe</a></td>
              <td>jmd@remote.org</td>
              <td>Information Technology Department</td>
              <td>ITD</td>
              <td>Programmer</td>
              <td>Active</td>
            </tr>
            <tr>
              <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
              <td><a href="#/suppliers//info">150</a></td>
              <td style="max-width:200px"><a href="#/suppliers//info">John Mark Doe</a></td>
              <td>jmd@remote.org</td>
              <td>Information Technology Department</td>
              <td>ITD</td>
              <td>Programmer</td>
              <td>Active</td>
            </tr>
            <tr>
              <td><div class="text-center" style="float: left; width: 35px; height: 35px; border-radius: 50%; margin-right: 10px; overflow: hidden;background:#5d5d5d;color:#fff;">JD</div></td>
              <td><a href="#/suppliers//info">150</a></td>
              <td style="max-width:200px"><a href="#/suppliers//info">John Mark Doe</a></td>
              <td>jmd@remote.org</td>
              <td>Information Technology Department</td>
              <td>ITD</td>
              <td>Programmer</td>
              <td>Active</td>
            </tr>
          </tbody>
        </table>`
    __targ.innerHTML = ''
    __targ.append(__temp)
  }

  __bindListeners() {
    this.__opt.active == 'about' ? this.__about() : ''
    this.__opt.active == 'accounts' ? this.__accounts() : ''
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {
    this.template = document.createElement('section')
    // template settings
    this.template.setAttribute('style', 'margin-top:45px;padding-bottom:40px;height:100vh;overflow-y:auto;')
    this.template.classList.add('col-lg-12')
    this.template.id = 'supplier-section'
    this.template.innerHTML = `
      <style>${style.toString()} </style>
      <section>
        <supplier-info-menu></supplier-info-menu>
        <br/><br/>
        <suppliers-section-container></suppliers-section-container>
      </section>`

    this.showMenu({
      id: this.__opt.id,
      target: this.template.querySelector('supplier-info-menu'),
      menus: ['back', 'about', 'products', 'accounts'],
      active: this.__opt.active || 'about'
    })
    this.__bindListeners()
    return this.template
  }

    /**
   * Show menu based on payload
   * 
   * @param {Object} opt 
   */
  showMenu (opt) {
    return new Promise((resolve, reject) => {
      import('../../components/supplier-info-menu').then(res => {
        return new res.default(opt).then((html) => {
          const targ = opt.target
          if (targ) {
            targ.replaceWith(html)
          } else { 
            document.querySelector('#supplier-info-menu').replaceWith(html)
          }
          resolve()
        })
      })
    }) 
  }
}
