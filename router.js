const Router = require('koa-router')
const router = new Router()
const handlePark = require('./controller/handlePark')
const handleSalary = require('./controller/handleSalary')

// park
router.post('/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID', handlePark.userInfo)
router.post('/uip-icop/services', handlePark.parkMessage)
// router.post('/service/MobilePaylipServlet', handlePark.userId)

// salary
router.post('/service/MobilePaylipServlet', handleSalary.salaryInfo)

module.exports = router