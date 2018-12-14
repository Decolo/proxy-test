const Router = require('koa-router')
const router = new Router()
const handlePark = require('./controller/handlePark')
const handleSalary = require('./controller/handleSalary')

// park
router.post('/api/login', handlePark.login)
router.post('/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID', handlePark.userInfo)
router.post('/service/MobilePaylipServlet', handlePark.userId)
router.post('/uip-icop/services', handlePark.parkMessage)

// salary
// router.post('/service/MobilePaylipServlet', handleSalary.salaryInfo)

module.exports = router