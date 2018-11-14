const { RequestConfig, requestPromise, request, handleError } = require('./utils')

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
  var options = { 
    method: 'POST',
    url: 'http://erp.8531.cn/service/MobilePaylipServlet',
    headers: { 
      'cache-control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded' 
    },
    form: ctx.request.body 
  }
  
  try {
    const result = await new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
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
    
    const { response, body } = result
    ctx.response.statusCode = response.statusCode
    ctx.body = body
  } catch(error) {
    handleError(error)
  }
}

module.exports = {
  userId,
  userInfo,
  parkMessage,
  handleError
}