var QueryPark = (function() {
  function _QueryPark() {
    this.userCenter = {};
    this.init()
  };

  _QueryPark.prototype.init = function() {
    this.fetchUserCode();
    this.$infoContainer = $('.info-container');
    this.$noParkContainer = $('.no-park-container');
  };

  _QueryPark.prototype.fetchUserCode = function() {
    var self = this
    var ticket = getQueryString('ticket');
    if (!ticket) {
      alert('url中缺少ticket');
      return;
    }

    var timestamp = Date.parse(new Date());
    var uuid = setUUID();
    var signature = sha256('&&' + uuid + '&&' + timestamp + '&&Yc?32!&4<3u');
    var params = {
      ticket: ticket,
      timestamp: timestamp,
      token: md5(ticket + ';CY&2v#K!;' + timestamp)
    };

    var settings = {
      url: '/api/login',
      type: 'POST',
      dataType: 'json',
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-SESSION-ID': '',
        'X-REQUEST-ID': uuid,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature
      },
      success: function(res) {
        if (res.code == 0) {
          self.usercode = res.data.session.login_name
          // self.usercode = 'linsq'
          self.fetchUserInfo()
        } else {
          alert(res.code);
        };
      },
      error: function(error){
        alert(error, 'error');
      }
    };
    $.ajax(settings);
  };

  _QueryPark.prototype.fetchUserInfo = function() {
    var self = this;
    var settings = {
      // 'url': 'http://eip.8531.cn/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID',
      url: '/8531ClientService/InfoWebService/EIPWebService.asmx/GetUserInfoByUserID',
      type: 'POST',
      headers: {
        // default: application/x-www-form-urlencoded
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      dataType: 'xml',
      data: {
        'UserID': this.usercode
      },
      success: function(res) {
        var data;
        if (typeof res === 'string') {
          data = JSON.parse(res);
        } else {
          data = JSON.parse(res.children[0].innerHTML);
        };
        self.fetchUserID(data);
      },
      error: function() {
        alert('获取用户信息出错');
      }
    };
    $.ajax(settings);
  };
  
  _QueryPark.prototype.requestTime = function(date) {
    var requestTimeString = '';
    requestTimeString += date.getFullYear();
    requestTimeString += date.getMonth() + 1;
    requestTimeString += date.getDate();
    requestTimeString += date.getHours();
    requestTimeString += date.getMinutes();
    requestTimeString += date.getSeconds();
    return requestTimeString;
  };

  _QueryPark.prototype.fetchUserID = function(userInfos) {
    var self = this;
    var visitTime = Date.parse(new Date());
  
    var settings = {
      // http://erp.8531.cn/service/MobilePaylipServlet
      url: '/service/MobilePaylipServlet',
      type: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      dataType: 'json',
      data: {
        method: 'getClerkCode',
        usercode: this.usercode,
        visitTime: visitTime,
        key: md5('getClerkCode_' + visitTime + '_^#Erp,.[-]')
      },
      success: function(res) {
        var data;
        if (typeof res === 'string') {
          data = JSON.parse(res);
        } else {
          data = res;
        };
        // alert(JSON.stringify(res))

        if (data.des !== '查询成功！') {
          alert('查询工号失败');
          return;
        };
        
        var userID = data.clerkCode;
        if (userInfos.Rows.length) {
          var userInfo = userInfos.Rows[0];
          self.userCenter.username = userInfo.UserName;
          self.userCenter.userID = userID;
          self.userCenter.userLoginName = userInfo.userLoginName;
          self.userCenter.mobile = userInfo.Mobile;
          // alert(JSON.stringify(self.userCenter))
          self.fetchParkInfo();
        } else {
          self.renderNoPark();
        };
      },
      'error': function() {
        alert('获取工号出错');
      }
    };
  
    $.ajax(settings);
  };
  
  _QueryPark.prototype.fetchParkInfo = function() {
    var self = this;
    var date = new Date();
    var transactionID = Date.parse(date).toString();
    
    var busiInfo = {
      licensePlate: '',
      custCode: this.userCenter.userID,
      custName: this.userCenter.username,
      phone: this.userCenter.mobile
    };

    var busiInfoString = JSON.stringify({
      busiInfo: busiInfo
    });

    var md5String = busiInfoString.substring(1, busiInfoString.length - 1);
    var sign = md5(transactionID + md5String.length + md5String + 'MD5Key');
  
    var params = {
      busiInfo: busiInfo,
      reqPubInfo: {
        systemNo: '01',
        method: 'queryCustomerBalance',
        transactionID: transactionID.toString(),
        requestTime: this.requestTime(date),
        version: '1.0',
        sign: sign
      }
    };
    
    var settings = {
      // 'url': 'http://parking.8531.cn:9092/uip-icop/services/'
      url: '/uip-icop/services',
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': ''
      },
      data: JSON.stringify(params),
      success: function(res) {
        self.render(res);
      },
      error: function() {
        alert('请求停车信息出错');
        console.log('请求停车信息出错');
      }
    };
    $.ajax(settings);
  };

  _QueryPark.prototype.render = function(data) {
    var busiInfo = data.busiInfo;
  
    if (busiInfo.customerInfo) {
      this.renderInfo(busiInfo);
    } else {
      this.renderNoPark();  
    };
  };

  _QueryPark.prototype.renderInfo = function(busiInfo) {
    this.$infoContainer.css({
      'display': 'block'
    });
    this.$noParkContainer.css({
      'display': 'none'
    });
    $('.name').text(this.userCenter.username);
    $('.data.worker-id').text(this.userCenter.userID);
    $('.data.car-id').text(busiInfo.customerInfo.licensePlate);
    $('.data.time-left').text(busiInfo.customerInfo.balanceInfos[0].balanceUnit + '小时');
  };

  _QueryPark.prototype.renderNoPark = function() {
    this.$infoContainer.css({
      'display': 'none'
    });
    this.$noParkContainer.css({
      'display': 'block'
    });
  };

  return {
    init: function() {
      new _QueryPark();
    }
  };
})();

$(document).ready(function() {
  QueryPark.init(); 
});

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }    
  return null;
}

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
}