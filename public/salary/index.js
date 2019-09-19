var QuerySalary = (function() {
  function _QuerySalary() {
    this.init().fetchUserCode().initMobileSelect().bindEvent();
    // this.fetchSalaryInfo();
  };

  _QuerySalary.prototype.init = function() {
    this.$login = $('.login');
    this.$submitBtn = $('.submit');
    this.$salaryInfo = $('.salary-info');
    this.$inputPwd = $('.input-pwd');
    this.$salaryList = $('.salary-list');
    this.$dateBox = $('#mobileSelect-date')
    this.$login.show();
    this.$salaryInfo.hide();

    return this;
  };

  _QuerySalary.prototype.bindEvent = function() {
    var self = this;
    
    this.$submitBtn.on('click', function() {
      var inputVal = self.$inputPwd.val().trim();
      if (!inputVal) {
        alert('密码不为空');
        return;
      };
      self.password = inputVal;
      self.fetchSalaryInfo();
    });

    return this;
  };

  _QuerySalary.prototype.initMobileSelect = function() {
    var self = this;
    var monthes = [], years = [];
    var dateNow = new Date();
    this.yearNow = dateNow.getFullYear();
    this.monthNow = dateNow.getMonth() + 1;
    var monthNowIndex;
    for (var i = 1; i <= 12; i++) {
      if (this.monthNow === i) {
        monthNowIndex = i - 1;
      }
      monthes.push(i);
    };
    for (var j = 1987; j <= this.yearNow; j++) {
      years.push(j);
    };
  
    new MobileSelect({
      trigger: '#mobileSelect-date',
      title: '请选择',
      wheels: [
        {data: years},
        {data: monthes}
      ],
      // positions: [0, 0],
      position:[years.length - 1, monthNowIndex],
      callback: function(indexArr, data) {
        self.fetchSalaryInfo(data) ;
      },
      ensureBtnColor: '#b83e3d',
    });

    return this;
  }
  
  _QuerySalary.prototype.fetchUserCode = function() {
    var self = this;
    var ticket = getQueryString('ticket');
    if (!ticket) {
      alert('url中缺少ticket');
      return;
    }

    var timestamp = Date.parse(new Date());
    var uuid = setUUID();
    var signature = sha256('&&' + uuid + '&&' + timestamp + '&&Yc?32!&4<3u');
    var data = {
      ticket: ticket,
      timestamp: timestamp,
      token: md5(ticket + ';CY&2v#K!;' + timestamp)
    };

    var settings = {
      //'http://10.100.64.31:25000/api/login'
      url: '/api/login',
      type: 'POST',
      dataType: 'json',
      data: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-SESSION-ID': '',
        'X-REQUEST-ID': uuid,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature
      },
      success: function(res) {
        if (res.code == 0) {
          self.usercode = res.data.session.login_name || '';
          self.session_id = res.data.session.id || '';
          // self.usercode = 'wangrh';
          // self.usercode = 'caichen';
        } else {
          alert(res.message);
        };
      },
      error: function(error) {
        alert(error.toString());
      }
    };
    $.ajax(settings);

    return this;
  };

  _QuerySalary.prototype.fetchSalaryInfo = function(dates) {
    var self = this;
    if (!this.usercode) {
      alert('缺少usercode')
      return
    }
    var salarypswd = md5(this.password + '_^#Erp,.[-]').toUpperCase();
    var visitTime = Date.parse(new Date());
    var key = md5('getSalary_' + visitTime + '_^#Erp,.[-]');
    var data = {
      // 'method': 'getSalary',
      // 'usercode': this.usercode,
      'salarypswd': salarypswd,
      'visitTime': visitTime,
      'key': key
    };
    if (dates && dates.length) {
      data.year = dates[0];
      data.period = dates[1];
    };

    var session_id = this.session_id || '';
    var request_id = setUUID();
    var timestamp = Date.parse(new Date());
    var signature = sha256(session_id + '&&' + request_id + '&&' + timestamp + '&&' + 'Yc?32!&4<3u');

    var headers = {
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache',
      'X-SESSION-ID': session_id,
      'X-REQUEST-ID': request_id,
      'X-TIMESTAMP': timestamp,
      'X-SIGNATURE': signature
    }

    var settings = {
      //'http://10.100.68.97/service/MobilePaylipServlet'
      // 'url': '/service/MobilePaylipServlet',
      'url': '/api/erp/salary',
      'type': 'POST',
      'headers': headers,
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
          self.render(data.year, data.period, res)
        }
      },
      'error': function() {
        alert('请求薪资出错')
        console.log('请求薪资出错')
      }
    };
    $.ajax(settings);
  }

  _QuerySalary.prototype.render = function(year, month, data) {
    var year = year || this.yearNow;
    var month = month || this.monthNow;
    var salarystructlist = data.salarystructlist;
    var salarydetaillist, clerkInfo;
    var listTemplate = '';
    if (salarystructlist.length) {
      salarydetaillist = salarystructlist[0].salarydetaillist;
      clerkInfo = {
        clerkCode: data.clerkCode,
        clerkName: salarydetaillist.shift().showcontent
      };
      $('.username').text(clerkInfo.clerkName);
      $('.work-id').text(clerkInfo.clerkCode);

      salarydetaillist.forEach(function(item) {
        listTemplate += '<li class="row"><div class="column item-name">' +
          item.showtitle + '</div><div class="data">' +
          item.showcontent + '</div></li>';
      });
      this.$salaryList.html(listTemplate);
      this.$dateBox.html(year + '-' + month);
    } 
  }

  return ({
    init: function() {
      new _QuerySalary();
    }
  });
})();

$(document).ready(function() {
  FastClick.attach(document.body);
  QuerySalary.init();
});

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }    
  return null;
};

function setUUID() {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';
  var uuid = s.join("");
  return uuid;
};

