const { RequestConfig, requestPromise, handleError } = require('./utils')

const salaryInfo = async(ctx) => {
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

module.exports = {
  salaryInfo
}