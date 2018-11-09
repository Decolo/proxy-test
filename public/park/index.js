var getUserId = function() {
  var matchUserId = location.href.match('UserId=\\w*', 'gi')

  if (matchUserId) {
    return matchUserId[0].split('=')[1]
  } else {
    alert('url中缺少UserId')
    return 
  }
}

var checkPark = function(data) {
  var transactionID = new Date().getTime()
  var busiInfo = {
    "licensePlate": "",
    "custCode": data.UserID,
    "custName": data.UserName,
    "phone": data.Mobile
  }

  var md5String = JSON.stringify({busiInfo})
  var sign = md5(transactionID + md5String.length + md5String + 'MD5Key')

  var params = {
    "busiInfo": busiInfo,
    "reqPubInfo": {
      "systemNo": "01",
      "method": "queryCustomerBalance",
      "transactionID": transactionID,
      "requestTime": "20181106155904",
      "version": "1.0",
      "sign": sign
    }
  }
  
  var settings = {
    // "url": "http://parking.8531.cn:9092/uip-icop/services/"
    "url": "/uip-icop/services",
    "type": "POST",
    "headers": {
      "Content-Type": "application/json",
      "cache-control": "no-cache",
    },
    "data": JSON.stringify(params),
    "success": function(data) {
      console.log(data)
    },
    "error": function(xhr, type) {
      alert('请求停车信息出错')
      console.log('请求停车信息出错')
    }
  }
  $.ajax(settings)
}

var render = function(data) {
  
  
  
}

$(document).ready(function() {
  var userId = getUserId()

  var settings = {
    // "url": "http://eip.8531.cn/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID",
    "url": "/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID",
    "type": "POST",
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
    },
    "dataType": "xml",
    "data": {
      "UserID": "caichen"
    },
    "success": function(data) {
      var userInfo
      if (typeof data === 'string') {
        userInfo = JSON.parse(data)
      } else {
        userInfo = JSON.parse(data.children[0].innerHTML)
      }
      checkPark(userInfo.Rows[0])
    },
    "error": function() {
      alert('获取用户信息出错')
    }
  }
  $.ajax(settings)
})