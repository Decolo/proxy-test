const qs = require('querystring')
const http = require('http')
const url = require('url')

const post = options => {
  return new Promise((resolve, reject) => {
    http.request(options, res => {
      const chunks = []
  
      res.on('data', chunk => {
        chunks.push(chunk)
      })
  
      res.on('end', () => {
        const body = Buffer.concat(chunks)
        resolve(body)
      })

      res.on('error', error => {
        reject(error.toString())
      })

      req.write(qs.stringify({ UserID: 'caichen' }))
      req.end()
    })
  })
  
}

http.createServer(async(req, res) => {
  const options = {
    method: req.method,
    protocol: 'http:',
    hostname: 'eip.8531.cn',
    path: url.parse(req.url)['pathname'],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  }

  try {
    const result = await post(options)
    res.end(result)
  } catch(error) {
    console.log(error)
  }
}).listen(3001, () => console.log('The server is started on PORT 3001'))



