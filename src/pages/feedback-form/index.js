import Quill from 'quill'

class template {
  constructor (params) {
    this.__params = params
    this.__info = {}
    this.__quill = ''
   
  }

  __bindListeners () {
    this.__loadQuill()
    this.__send()
  }

  __send () {
    return this.template.querySelector('.add-feedback-button').addEventListener('click', () => {
      const content = this.__quill.root.innerHTML
      const quillCount = this.__quill.getText().length > 5
      const __payload = {
        token: window.localStorage.getItem('token'),
        feedback: content,
        action: 'create'
      }
      
      if (quillCount) {
        import('../../services/feedback-services').then(res => {
          return new res.default().feedback(__payload).then((data) => {
            if (data > 0) {
              // show success
              this.template.innerHTML = `
                <article class="col-12  col-lg-6 offset-lg-4" style="margin-top:150px;overflow:auto;padding-bottom:30px">
                  <div class="alert alert-success text-center">
                    <i class="material-icons md-18">tag_faces</i> Thank you for sharing your experience with us. Your feedback matters!
                  </div>
                </article>
              `
            }
          })
        })
      }
    })
  }

  __loadQuill () {
    this.__quill = new Quill(this.template.querySelector('#editor'), {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'link'],
          ['code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ]
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'  // or 'bubble'
      })
      // stylesheet
      const styl = document.createElement('link')
      styl.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
      styl.rel = 'stylesheet'
      styl.type = 'text/css'
      this.template.append(styl)
  }

  /**
   * Return template as HTMLObject to be rendered in DOM
   */
  async render () {

    this.template = document.createElement('article')

    // template settings
    this.template.setAttribute('style', "margin-top: 150px;overflow:auto;padding-bottom: 30px;")
    this.template.classList.add('col-12', 'col-lg-7', 'col-md-7', 'offset-lg-2')
    this.template.id = 'feedback-section'
    this.template.innerHTML = `
      <section id="reg-notif-area"></section>
      <section class="col-12">
        <p>
          <h3><i class="material-icons">feedback</i> Feedback</h3>
          <p>We want to hear your experience in using the system. This will help us to improve the system and make the best out of it.</p>
        </p><br/><br/><br/>
      </section>
      <section id="bid-form-status"></section>
      <section id="editor" style="height: 375px;"></section><br/>
      <section class="col-md-12 row"><button class="btn btn-dark btn-md add-feedback-button">submit</button></section>`
    this.__bindListeners()
    return this.template
  }

}


export { template }