var QueryPark = (function() {
  function _QueryPark() {
    this.userCenter = {};
    this.init()
  };

  _QueryPark.prototype.init = function() {
    this.userCenter = {};
    this.fetchUserInfo();
    this.$infoContainer = $('.info-container');
    this.$noParkContainer = $('.no-park-container');
    this.$infoContainer.hide();
    this.$noParkContainer.hide();
  };

  _QueryPark.prototype.fetchUserInfo = function() {
    var self = this
    var ticket = getQueryString('ticket');
    if (!ticket) {
      alert('url中缺少ticket');
      return;
    };

    var timestamp = Date.parse(new Date());
    var uuid = setUUID();
    var signature = sha256('&&' + uuid + '&&' + timestamp + '&&Yc?32!&4<3u');
    var data = {
      ticket: ticket,
      timestamp: timestamp,
      token: md5(ticket + ';CY&2v#K!;' + timestamp)
    };

    var settings = {
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
          var data = res.data.session;
          var usercode = data.login_name
          if (!usercode) {
            alert('缺少usercode');
            return;
          }
          self.userCenter.usercode = usercode;
          self.userCenter.username = data.name;
          self.userCenter.mobile = data.tel_number;
          self.fetchUserID();
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

  _QueryPark.prototype.fetchUserID = function() {
    var self = this;

    var visitTime = Date.parse(new Date());
    var data = {
      method: 'getClerkCode',
      usercode: this.userCenter.usercode,
      visitTime: visitTime,
      key: md5('getClerkCode_' + visitTime + '_^#Erp,.[-]')
    };
  
    var settings = {
      url: '/service/MobilePaylipServlet',
      type: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      dataType: 'json',
      data: data,
      success: function(res) {
        if (res.flag === 0) {
          self.userCenter.userID = res.clerkCode;
          self.fetchParkInfo();
        } else {
          alert(res.des);
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
    
    var data = {
      busiInfo: busiInfo,
      reqPubInfo: {
        systemNo: '01',
        method: 'queryCustomerBalance',
        transactionID: transactionID.toString(),
        requestTime: requestTime(date),
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
      data: JSON.stringify(data),
      dataType: 'json',
      success: function(res) {
        var result = res.resPubInfo.result;
        if (result.code === '0000') {
          self.render(res);  
        } else {
          alert(result.message);
        };
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
    this.$infoContainer.show();
    this.$noParkContainer.hide();
    var leftMin = Number(busiInfo.customerInfo.balanceInfos[0].accountBalance);
    var timeString = '' + Math.floor(leftMin / 60) + '小时' + leftMin % 60 + '分钟';
    $('.name').text(this.userCenter.username);
    $('.data.worker-id').text(this.userCenter.userID);
    $('.data.car-id').text(busiInfo.customerInfo.licensePlate);
    $('.data.time-left').text(timeString);
  };

  _QueryPark.prototype.renderNoPark = function() {
    this.$infoContainer.hide();
    this.$noParkContainer.show();
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
  var uuid = s.join('');
  return uuid;
};

function requestTime(date) {
  var requestTimeString = '';
  requestTimeString += date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  requestTimeString += month < 10 ? '0' + month : month;
  requestTimeString += day < 10 ? '0' + day : day;
  requestTimeString += date.getHours();
  requestTimeString += date.getMinutes();
  requestTimeString += date.getSeconds();
  return requestTimeString;
};