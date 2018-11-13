var request = require('request')

var options = { 
  method: 'POST',
  url: 'http://parking.8531.cn:9092/uip-icop/services/',
  headers: { 
    'cache-control': 'no-cache',
    'Content-Type': 'application/json' 
  },
  body: {
    busiInfo: { 
      licensePlate: '',
      custCode: '10434',
      custName: '王震',
      phone: '18368865748' 
    },
    reqPubInfo: { 
      systemNo: '01',
      method: 'queryCustomerBalance',
      transactionID: '1541491144467',
      requestTime: '20181106155904',
      version: '1.0',
      sign: '56c34b4f55c0d63899aa967b54e56c8e' 
    } 
  },
  json: true
}

request(options, function (error, response, body) {
  if (error) throw new Error(error)

  console.log(typeof body)
})

// var options = { 
//   method: 'POST',
//   url: 'http://eip.8531.cn/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID',
//   headers: { 
//     'cache-control': 'no-cache',
//     'Content-Type': 'application/x-www-form-urlencoded' 
//   },
//   form: { 
//     UserID: 'caichen' 
//   } 
// }

// request(options, function (error, response, body) {
//   if (error) throw new Error(error)

//   console.log(body)
// })
