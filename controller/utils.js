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
  headerParser() {
    const headers = this.ctx.request.header
    delete headers.host
    delete headers.origin
    delete headers.referer
    const contentType = this.ctx.request.header['content-type'] || 'application/x-www-form-urlencoded'  
    delete headers['content-type']
    headers['Content-Type'] = contentType
    this.options = {
      ...this.options,  
      headers
    }
    return this
  }
  bodyParser() {
    const contentType = this.ctx.request.header['Content-Type'] || 'application/x-www-form-urlencoded'
    switch (contentType) {
      case 'application/json': 
        this.options = {
          ...this.options,
          body: this.ctx.request.body,
          json: true
        }   
        break
      default:
        this.options = {
          ...this.options,
          form: this.ctx.request.body   
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