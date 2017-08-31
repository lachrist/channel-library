
var Factory = require("./index.js");
var LogSocket = require("../../common/log-socket.js");
var Onrequest = require("../../common/onrequest.js");
var Onconnect = require("../../common/onconnect.js");

var counter = 0;

module.exports = function (name) {
  var self = this;
  name = name || "";
  return Factory({
    __onrequest__: function (method, path, headers, body, callback) {
      var id = counter++;
      console.log(name+"req#"+id+" "+method+" "+path+" "+JSON.stringify(headers)+" "+body);
      Onrequest(self, method, path, headers, body, function (status, reason, headers, body) {
        console.log(name+"res#"+id+" "+status+" "+reason+" "+JSON.stringify(headers)+" "+body);
        callback(status, reason, headers, body);
      });
    },
    __onconnect__: function (path, con) {
      var id = counter++;
      console.log(name+"con#"+id+" "+path);
      Onconnect(self, path, LogSocket(con, name+"con#"+id));
    }
  });
};

// Cyclical dependency //
