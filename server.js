const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const staticParser = require('koa-static')
const app = new Koa()
const router = require('./router')

app.use(bodyParser())

app.use(staticParser(path.resolve(__dirname, './public')))
app.use(router.routes())

app.listen(3000, console.log('Listenning on port 3000'))