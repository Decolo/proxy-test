const qs = require('querystring')
const request = require('request')

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

const userInfo = async(ctx) => {
  const url = 'http://eip.8531.cn' + ctx.request.url
  const requestConfig = new RequestConfig(ctx, url).headerParser().bodyParser()

  try {
    const result = await requestPromise(requestConfig.options)
    const { response, body } = result
    const { statusCode = 404 } = response
    ctx.response.statusCode = statusCode
    ctx.body = body
  } catch(error) {
    handleError(error)
  }
}

const parkMessage = async(ctx) => {
  var options = { 
    method: 'POST',
    url: 'http://parking.8531.cn:9092/uip-icop/services/',
    headers: { 
      'cache-control': 'no-cache',
      'Content-Type': 'application/json' 
    },
    body: ctx.request.body,
    json: true
  }
  
  const result = await new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        reject(error)
      }
      resolve({
        response,
        body
      })
    })
  })
  const { response, body } = result
  ctx.response.statusCode = response.statusCode
  ctx.body = body
}

const userId = async(ctx) => {
  const url = 'http://eip.8531.cn' + ctx.request.url
  const requestConfig = new RequestConfig(ctx, url).headerParser().bodyParser()

  try {
    const result = await requestPromise(requestConfig.options)
    const { response, body } = result
    const { statusCode = 404 } = response
    ctx.response.statusCode = statusCode
    ctx.body = body
  } catch(error) {
    handleError(error)
  }
}

const handleError = error => {
  console.log('error:' + String(error))
  ctx.response.status = 500
  ctx.response.body = 'Server Error'
}

module.exports = {
  userInfo,
  parkMessage
}