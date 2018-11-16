if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body)
	}, false)
}

var QuerySalary = (function() {
  function _QuerySalary() {
    this.init().bindEvent().initMobileSelect()
  }

  _QuerySalary.prototype.init = function() {
    this.usercode = this.getUserCode()
    this.$login = $('.login')
    this.$submitBtn = $('.submit')
    this.$salaryInfo = $('.salary-info')
    this.$inputPwd = $('.input-pwd')
    this.$salaryList = $('.salary-list')
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

  _QuerySalary.prototype.initMobileSelect = function() {
    var self = this
    var monthes = [], years = []
    var dateNow = new Date()
    var yearNow = dateNow.getFullYear()
    var monthNow = dateNow.getMonth() + 1
    var monthNowIndex
    for (var i = 1; i <= 12; i++) {
      if (monthNow === i) {
        monthNowIndex = i - 1
      }
      monthes.push(i)
    }
    for (var j = 1949; j <= yearNow; j++) {
      years.push(j)
    }
  
    new MobileSelect({
      trigger: '#mobileSelect-date',
      title: '请选择',
      wheels: [
        {data: years},
        {data: monthes}
      ],
      position:[years.length - 1, monthNowIndex],
      callback: function(indexArr, data) {
        self.fetchSalaryInfo(data)
      },
      ensureBtnColor: 'red',
    })
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

  _QuerySalary.prototype.fetchSalaryInfo = function(dates) {
    var self = this
    var visitTime = new Date().getTime().toString()
    var key = md5('getSalary_' + visitTime + '_^#Erp,.[-]')
    var salarypswd = md5(this.password + '_^#Erp,.[-]').toUpperCase()

    var data = {
      'method': 'getSalary',
      'usercode': this.usercode,
      'salarypswd': salarypswd,
      'visitTime': visitTime,
      'key': key
    }
    if (dates && dates.length) {
      data.year = dates[0]
      data.period = dates[1]
    }
    var settings = {
      // http://10.100.60.70:87/uapws/service/IMobilePaylipService?wsdl
      // http://61.164.45.179:1099/service/IMobilePaylipService?wsdl
      'url': '/service/MobilePaylipServlet',
      'type': 'POST',
      'headers': {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
      'data': data,
      'dataType': 'json',
      'success': function(res) {
        if (Number(res.flag)) {
          alert(res.des)
        } else {
          self.$login.css({
            display: 'none'
          })
          self.$salaryInfo.css({
            display: 'block'
          })
          self.render(res)
        }
      },
      'error': function(xhr, type) {
        alert('请求薪资出错')
        console.log('请求薪资出错')
      }
    }
    $.ajax(settings)
  }

  _QuerySalary.prototype.render = function(data) {
    var salarystructlist = data.salarystructlist
    var salarydetaillist, clerkInfo
    var listTemplate = ''
    if (salarystructlist.length) {
      salarydetaillist = salarystructlist[0].salarydetaillist
      clerkInfo = {
        clerkCode: data.clerkCode,
        clerkName: salarydetaillist.shift().showcontent
      }
      $('.username').text(clerkInfo.clerkName)
      $('.work-id').text(clerkInfo.clerkCode)

      salarydetaillist.forEach(function(item) {
        listTemplate += '<li class="row"><div class="column item-name">' +
          item.showtitle + '</div><div class="data"></div>' +
          item.showcontent + '</div></li>'
      })
      this.$salaryList.html(listTemplate)
    } 
  }

  return ({
    init: function() {
      new _QuerySalary()
    }
  })
})()

$(document).ready(function() {
  QuerySalary.init()
})
