var requestTime = function(date) {
  var requestTimeString = ''
  requestTimeString += date.getFullYear()
  requestTimeString += date.getMonth() + 1
  requestTimeString += date.getDate()
  requestTimeString += date.getHours()
  requestTimeString += date.getMinutes()
  requestTimeString += date.getSeconds()
  return requestTimeString
}

var getUserName = function() {
  var matchUserName = location.href.match('UserId=\\w*', 'gi')

  if (matchUserName) {
    return matchUserName[0].split('=')[1]
  } else {
    alert('url中缺少UserId')
    return 
  }
}

var checkPark = function(data) {
  var date = new Date()
  var transactionID = date.getTime().toString()
  
  var busiInfo = {
    'licensePlate': '',
    'custCode': data.userID,
    'custName': data.username,
    'phone': data.mobile
  }
  var busiInfoString = JSON.stringify({
    busiInfo: busiInfo
  })
  var md5String = busiInfoString.substring(1, busiInfoString.length - 1)
  var sign = md5(transactionID + md5String.length + md5String + 'MD5Key')

  var params = {
    'busiInfo': busiInfo,
    'reqPubInfo': {
      'systemNo': '01',
      'method': 'queryCustomerBalance',
      'transactionID': transactionID.toString(),
      'requestTime': requestTime(date),
      'version': '1.0',
      'sign': sign
    }
  }

  var settings = {
    // 'url': 'http://parking.8531.cn:9092/uip-icop/services/'
    'url': '/uip-icop/services',
    'type': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
    },
    'data': JSON.stringify(params),
    'success': function(result) {
      render(result, data)
    },
    'error': function(xhr, type) {
      alert('请求停车信息出错')
      console.log('请求停车信息出错')
    }
  }
  $.ajax(settings)
}

var renderInfo = function(userCenter) {
  $('.info-container').css({
    'display': 'block'
  })
  $('.no-park-container').css({
    'display': 'none'
  })
  $('.name').text(userCenter.username)
  $('.data.worker-id').text(userCenter.userID)
  $('.data.car-id').text(busiInfo.customerInfo.licensePlate)
  $('.data.time-left').text(busiInfo.customerInfo.balanceInfos[0].accountBalance)
}

var renderNoPark = function() {
  $('.info-container').css({
    'display': 'none'
  })
  $('.no-park-container').css({
    'display': 'block'
  })
}

var render = function(data, userCenter) {
  var busiInfo = data.busiInfo

  if (busiInfo.customerInfo) {
    renderInfo(userCenter)
  } else {
    renderNoPark()  
  }
}

var queryUserID = function() {
  var visitTime = new Date().getTime()

  var settings = {
    // http://erp.8531.cn/service/MobilePaylipServlet
    'url': '/service/MobilePaylipServlet',
    'type': 'POST',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache',
    },
    'data': {
      'method': 'getClerkCode',
      'usercode': '',
      'visitTime': visitTime + '',
      'key': md5('getClerkCode_' + visitTime + '_^#Erp,.[-]')
    },
    'success': function(data) {
      
    },
    'error': function(error) {
      alert('获取工号出错')
    }
  }
}

var queryUserInfo = function(userName, userCenter) {
  var settings = {
    // 'url': 'http://eip.8531.cn/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID',
    'url': '/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID',
    'type': 'POST',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache',
    },
    'dataType': 'xml',
    'data': {
      'UserID': userName
    },
    'success': function(data) {
      var result
      if (typeof data === 'string') {
        result = JSON.parse(data)
      } else {
        result = JSON.parse(data.children[0].innerHTML)
      }

      queryUserID
      
      if (result.Rows.length) {
        var userInfo = result.Rows[0]
        userCenter.username = userInfo.UserName
        userCenter.userID = userInfo.UserID
        userCenter.userLoginName = userInfo.userLoginName
        userCenter.mobile = userInfo.Mobile
      
        checkPark(userCenter)
      } else {
        renderNoPark()
      }
    },
    'error': function() {
      alert('获取用户信息出错')
    }
  }
  $.ajax(settings)
}

$(document).ready(function() {
  var userName = getUserName()
  var userCenter = {}

  queryUserInfo(userName, userCenter)
})