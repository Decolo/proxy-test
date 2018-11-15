var QueryPark = (function() {
  function _QueryPark() {
    this.userCenter = {}
    this.init().fetchUserInfo()
  }

  _QueryPark.prototype.init = function() {
    this.usercode = this.getUserCode()
    this.$infoContainer = $('.info-container')
    this.$noParkContainer =$('.no-park-container')
    return this
  }

  _QueryPark.prototype.getUserCode = function() {
    var matchUserCodes = location.href.match('UserId=\\w*', 'gi')

    if (matchUserCodes) {
      return matchUserCodes[0].split('=')[1]
    } else {
      alert('url中缺少UserId')
      return 
    }
  }

  _QueryPark.prototype.fetchUserInfo = function() {
    var self = this
    var settings = {
      // 'url': 'http://eip.8531.cn/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID',
      'url': '/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID',
      'type': 'POST',
      'headers': {
        // default: application/x-www-form-urlencoded
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
      'dataType': 'xml',
      'data': {
        'UserID': this.usercode
      },
      'success': function(data) {
        var result
        if (typeof data === 'string') {
          result = JSON.parse(data)
        } else {
          result = JSON.parse(data.children[0].innerHTML)
        }
  
        self.fetchUserID(result)
      },
      'error': function() {
        alert('获取用户信息出错')
      }
    }
    $.ajax(settings)
  }
  
  _QueryPark.prototype.requestTime = function(date) {
    var requestTimeString = ''
    requestTimeString += date.getFullYear()
    requestTimeString += date.getMonth() + 1
    requestTimeString += date.getDate()
    requestTimeString += date.getHours()
    requestTimeString += date.getMinutes()
    requestTimeString += date.getSeconds()
    return requestTimeString
  }

  _QueryPark.prototype.fetchUserID = function(userInfos) {
    var self = this
    var visitTime = new Date().getTime().toString()
  
    var settings = {
      // http://erp.8531.cn/service/MobilePaylipServlet
      'url': '/service/MobilePaylipServlet',
      'type': 'POST',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
      'dataType': 'json',
      'data': {
        'method': 'getClerkCode',
        'usercode': this.usercode,
        'visitTime': visitTime,
        'key': md5('getClerkCode_' + visitTime + '_^#Erp,.[-]')
      },
      'success': function(res) {
        var data
        if (typeof res === 'string') {
          data = JSON.parse(res)
        } else {
          data = res
        }
        if (data.des !== '查询成功！') {
          alert(查询工号失败)
          return
        }
        
        var userID = data.clerkCode
        if (userInfos.Rows.length) {
          var userInfo = userInfos.Rows[0]
          self.userCenter.username = userInfo.UserName
          self.userCenter.userID = userID
          self.userCenter.userLoginName = userInfo.userLoginName
          self.userCenter.mobile = userInfo.Mobile
        
          self.checkPark()
        } else {
          self.renderNoPark()
        }
      },
      'error': function(error) {
        alert('获取工号出错')
      }
    }
  
    $.ajax(settings)
  }
  
  _QueryPark.prototype.checkPark = function() {
    var self = this
    var date = new Date()
    var transactionID = date.getTime().toString()
    
    var busiInfo = {
      'licensePlate': '',
      'custCode': this.userCenter.userID,
      'custName': this.userCenter.username,
      'phone': this.userCenter.mobile
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
        'requestTime': this.requestTime(date),
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
        self.render(result)
      },
      'error': function(xhr, type) {
        alert('请求停车信息出错')
        console.log('请求停车信息出错')
      }
    }
    $.ajax(settings)
  }

  _QueryPark.prototype.render = function(data) {
    var busiInfo = data.busiInfo
  
    if (busiInfo.customerInfo) {
      this.renderInfo(busiInfo)
    } else {
      this.renderNoPark()  
    }
  }

  _QueryPark.prototype.renderInfo = function(busiInfo) {
    this.$infoContainer.css({
      'display': 'block'
    })
    this.$noParkContainer.css({
      'display': 'none'
    })
    $('.name').text(this.userCenter.username)
    $('.data.worker-id').text(this.userCenter.userID)
    $('.data.car-id').text(busiInfo.customerInfo.licensePlate)
    $('.data.time-left').text(busiInfo.customerInfo.balanceInfos[0].balanceUnit + '小时')
  }

  _QueryPark.prototype.renderNoPark = function() {
    this.$infoContainer.css({
      'display': 'none'
    })
    this.$noParkContainer.css({
      'display': 'block'
    })
  }

  return {
    init: function() {
      new _QueryPark()
    }
  }
})()

$(document).ready(function() {
  QueryPark.init()  
})