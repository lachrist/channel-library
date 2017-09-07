
var LogSocket = require("../../common/log-socket.js");
var Split = require("./split.js");

var rcounter = 0;
var ccounter = 0;

function request (method, path, headers, body, callback) {
  var name = this.__name__;
  var path = this.__prefix__+path;
  var id = rcounter++;
  console.log(name+"req#"+id+" "+method+" "+path+" "+JSON.stringify(headers)+" "+body);
  if (!callback) {
    var res = this.__emitter__.request(method, path, headers, body);
    console.log(name+"res#"+id+" "+res[0]+" "+res[1]+" "+JSON.stringify(res[2])+" "+res[3]);
    return res;
  }
  this.__emitter__.request(method, path, headers, body, function (error, status, reason, headers, body) {
    console.log(name+"res#"+id+" "+status+" "+reason+" "+JSON.stringify(headers)+" "+body);
    callback(error, status, reason, headers, body);
  });
}

function connect (path) {
  var id = ccounter++;
  console.log(this.__name__+"con#"+id+" "+this.__prefix__+path);
  return LogSocket(this.__emitter__.connect(this.__prefix__+path), this.__name__+"con#"+id);
}

module.exports = function (name) {
  var self = Object.create(Prototype);
  self.request = request;
  self.connect = connect;
  self.__prefix__ = "";
  self.__emitter__ = this;
  self.__name__ = name || "";
  return self;
};

// Cyclical dependency //
var Prototype = require("./index.js");