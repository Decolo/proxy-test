const qs = require('querystring')
const http = require('http')
// const iconv = require('iconv-lite')

const filterHeader = (ctx, options) => {
  const headers = ctx.request.header
  delete headers.host
  delete headers.origin
  delete headers.referer
  return {
    ...options,
    headers
  }
}

const post = (options, data) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      const chunks = []
  
      res.on('data', chunk => {
        // console.log(options.hostname + chunk.toString())
        chunks.push(chunk)
      })
  
      res.on('end', () => {
        const body = Buffer.concat(chunks)
        resolve(body)
      })
    })

    req.on('error', (e) => {
      reject(`problem with request: ${e.message}`)
    })
    
    if (typeof data === 'string') {
      req.write(data)
    } else if (options.headers['content-type'] === 'application/x-www-form-urlencoded') {
      const _data = qs.stringify(data)
      req.write(_data)
    } else if (options.headers['content-type'] === 'application/json') {
      const _data = JSON.stringify(data)
      req.write(_data)
    } else {
      reject('error of Content-type')
    }
    
    req.end()
  })
}

const userInfo = async(ctx) => {
  const options = filterHeader(ctx, {
    method: ctx.request.method,
    hostname: 'eip.8531.cn',
    path: ctx.request.url,
  })

  try {
    const result = await post(options, ctx.request.body)
    ctx.body = result
  } catch(error) {
    console.log(error)
  }
}

const parkMessage = async(ctx) => {
  const options = filterHeader(ctx, {
    method: ctx.request.method,
    hostname: 'parking.8531.cn',
    port: 9092,
    path: ctx.request.url,
  })
  
  try {
    const result = await post(options, ctx.request.body)
    console.log(result.toString().length)
    ctx.response.status = 200
    ctx.response.body = result
  } catch(error) {
    console.log(error)
  }
}

module.exports = {
  userInfo,
  parkMessage
}