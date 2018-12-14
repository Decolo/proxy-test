const request = require('request')

const requestPromise = options => {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error)
      } else {
        resolve({
          response,
          body
        })
      }
    })
  })
}

class RequestConfig {
  constructor(ctx, url) {
    this.ctx = ctx
    this.options = {
      url,
      method: typeof ctx.request.method === 'string' ?
       ctx.request.method.toUpperCase()
       : 'GET'
    }
  }
  bodyParser() {
    const contentType = this.ctx.request.header['content-type'] || 'application/x-www-form-urlencoded'
    switch (contentType) {
      case 'application/json': 
        this.options = {
          ...this.options,
          body: this.ctx.request.body,
          json: true,
          headers: {
            'content-type': contentType
          }
        }   
        break
      default:
        this.options = {
          ...this.options,
          form: this.ctx.request.body,
          headers: {
            'content-type': contentType
          }
        }
    }
    return this
  }
}

const handleError = error => {
  console.log('error:' + String(error))
  ctx.response.status = 500
  ctx.response.body = 'Server Error'
}

module.exports = {
  RequestConfig,
  requestPromise,
  request,
  handleError
}