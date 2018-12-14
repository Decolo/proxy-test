const { RequestConfig, requestPromise, handleError } = require('./utils')

const login = async(ctx) => {
  const url = '10.100.64.31:25000' + ctx.request.url
  const requestConfig = new RequestConfig(ctx, url).bodyParser()

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

const userInfo = async(ctx) => {
  const url = 'http://eip.8531.cn' + ctx.request.url
  const requestConfig = new RequestConfig(ctx, url).bodyParser()

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
    handleError(error)
  }
}

const parkMessage = async(ctx) => {
  const url = 'http://parking.8531.cn:9092' + ctx.request.url
  const requestConfig = new RequestConfig(ctx, url).bodyParser()

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

module.exports = {
  userId,
  userInfo,
  parkMessage,
  handleError
}