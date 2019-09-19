const { RequestConfig, requestPromise, request, handleError } = require('./utils')

const login = async(ctx) => {
  // const url = 'http://10.100.64.31:25000' + ctx.request.url
  const url = 'https://oayd.8531.cn' + ctx.request.url
  const requestConfig = new RequestConfig(ctx, url).bodyParser()
  // console.log(requestConfig.options)
  try {
    const result = await requestPromise(requestConfig.options)
    const { response, body } = result
    const { statusCode = 404 } = response
    ctx.response.statusCode = statusCode
    ctx.body = body
  } catch(error) {
    handleError(error, ctx)
  }
}

const userInfo = async(ctx) => {
  const url = 'http://eip.8531.cn' + ctx.request.url
  const requestConfig = new RequestConfig(ctx, url).bodyParser()
  // console.log(requestConfig.options)
  try {
    const result = await requestPromise(requestConfig.options)
    const { response, body } = result
    const { statusCode = 404 } = response
    ctx.response.statusCode = statusCode
    ctx.body = body
  } catch(error) {
    handleError(error, ctx)
  }
}

const userId = async(ctx) => {
  const url = 'http://10.100.68.97' + ctx.request.url
  const requestConfig = new RequestConfig(ctx, url).bodyParser()
  try {
    const result = await requestPromise(requestConfig.options)
    const { response, body } = result
    const { statusCode = 404 } = response
    ctx.response.statusCode = statusCode
    ctx.body = body    
  } catch(error) {
    handleError(error, ctx)
  }
}

const parkMessage = async(ctx) => {
  const url = 'http://parking.8531.cn:9092' + ctx.request.url
  const requestConfig = new RequestConfig(ctx, url).bodyParser()
  // console.log(requestConfig.options)
  var options = { 
    method: 'POST',
    url: 'http://parking.8531.cn:9092' + ctx.request.url,
    headers: { 
      'Content-Type': 'application/json'
    },
    body: ctx.request.body,
    json: true
  }
  // console.log(options)

  try {
    const result = await requestPromise(requestConfig.options)
    const { response, body } = result
    const { statusCode = 404 } = response
    ctx.response.statusCode = statusCode
    // console.log(result)
    ctx.body = body    
  } catch(error) {
    handleError(error, ctx)
  }  
}

module.exports = {
  userId,
  userInfo,
  parkMessage,
  handleError,
  login
}