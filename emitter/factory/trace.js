
var Factory = require("./index.js");
var LogSocket = require("../../common/log-socket.js");

var counter = 0;

module.exports = function (name) {
  var self = this;
  return Factory({
    request: function (method, path, headers, body, callback) {
      var id = counter++;
      console.log(name+"req#"+id+" "+method+" "+path+" "+JSON.stringify(headers)+" "+body);
      if (!callback) {
        var res = self.request(method, path, headers, body);
        console.log(name+"res#"+id+" "+res[0]+" "+res[1]+" "+JSON.stringify(res[2])+" "+res[3]);
        return res;
      }
      self.request(method, path, headers, body, function (error, status, reason, headers, body) {
        console.log(name+"res#"+id+" "+status+" "+reason+" "+JSON.stringify(headers)+" "+body);
        callback(error, status, reason, headers, body);
      });
    },
    connect: function (path) {
      var id = counter++;
      console.log(name+"con#"+id+" "+path);
      return LogSocket(self.connect(path), name+"con#"+id);
    }
  });
};
