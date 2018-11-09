const path = require('path')
const Koa = require('koa')
const app = new Koa()
const router = require('./router')
const bodyParser = require('koa-bodyparser')
const staticParser = require('koa-static')

app.use(bodyParser())
app.use(staticParser(path.resolve(__dirname, './public')))
app.use(router.routes())

app.listen(3000)