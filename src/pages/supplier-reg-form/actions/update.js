const Serv = import('../../../services/supplier-service')

const view = (params) => {
  return new Promise((resolve, reject) => {
    Serv.then(res => {
      return new res.default().view(params).then(json => {
        resolve(json)
      })
    })
  }) 
}

export { view }