const Router = require('koa-router')
const router = new Router()
const user = require('./controller/user')
const handler = require('./controller/handler')

router.post('/user/login', user.login)
router.get('/user/profile', user.profile)
router.post('/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID', handler.userInfo)
router.post('/uip-icop/services', handler.parkMessage)
router.post('/service/MobilePaylipServlet', handler.userId)

module.exports = router