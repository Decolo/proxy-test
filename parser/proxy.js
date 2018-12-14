
const proxy = (ctx) => {
  this.options =  {
    method: typeof ctx.request.method === 'string' ?
       ctx.request.method.toUpperCase()
       : 'GET'
  }
  const contentType = ctx.request.header['content-type'] || 'application/x-www-form-urlencoded'
    switch (contentType) {
      case 'application/json': 
        this.ctx.options = {
          ...this.options,
          body: this.ctx.request.body,
          json: true,
          headers: {
            'content-type': contentType
          }
        }   
        break
      default:
        this.ctx.options = {
          ...this.options,
          form: this.ctx.request.body,
          headers: {
            'content-type': contentType
          }
        }
    }
}

module.exports = proxy