if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body)
	}, false)
}

var QuerySalary = (function() {
  function _QuerySalary() {
    this.init().bindEvent()
  }

  _QuerySalary.prototype.init = function() {
    this.usercode = this.getUserCode()
    this.$login = $('.login')
    this.$submitBtn = $('.submit')
    this.$salaryInfo = $('.salary-info')
    this.$inputPwd = $('.input-pwd')
    this.$login.css({
      display: 'block'
    })
    this.$salaryInfo.css({
      display: 'none'
    })
    return this
  }

  _QuerySalary.prototype.bindEvent = function() {
    var self = this
    
    this.$submitBtn.on('click', function() {
      var inputVal = self.$inputPwd.val().trim()
      if (!inputVal) {
        return
      }
      self.password = inputVal
      self.fetchSalaryInfo()
    })

    return this
  }

  _QuerySalary.prototype.getUserCode = function() {
    var matchUserCodes = location.href.match('UserId=\\w*', 'gi')

    if (matchUserCodes) {
      return matchUserCodes[0].split('=')[1]
    } else {
      alert('url中缺少UserId')
      return 
    }
  }

  _QuerySalary.prototype.fetchSalaryInfo = function() {
    var visitTime = new Date().getTime().toString()
    var key = md5('getSalary_' + visitTime + '_^#Erp,.[-]')
    var salarypswd = md5(this.password + '_^#Erp,.[-]')

    var settings = {
      // http://10.100.60.70:87/uapws/service/IMobilePaylipService?wsdl
      // http://61.164.45.179:1099/service/IMobilePaylipService?wsdl
      'url': '/uapws/service/IMobilePaylipService?wsdl',
      'type': 'POST',
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
      'data': {
        'method': 'getSalary',
        'usercode': this.usercode,
        'salarypswd': salarypswd,
        'visitTime': visitTime,
        'key': key
      },
      'success': function(res) {
        console.log(res)
      },
      'error': function(xhr, type) {
        alert('请求薪资出错')
        console.log('请求薪资出错')
      }
    }
    $.ajax(settings)
  }

  return ({
    init: function() {
      new _QuerySalary()
    }
  })
})()

QuerySalary.init()
