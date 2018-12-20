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
    const { host, origin, referer, ...headers } = ctx.request.headers
    this.options = {
      url,
      method: typeof ctx.request.method === 'string' ?
       ctx.request.method.toUpperCase()
       : 'GET',
      headers,
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
        }   
        break
      default:
        this.options = {
          ...this.options,
          form: this.ctx.request.body,
        }
    }
    return this
  }
}

const handleError = (error, ctx) => {
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