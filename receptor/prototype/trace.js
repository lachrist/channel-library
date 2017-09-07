
var LogSocket = require("../../common/log-socket.js");
var Onrequest = require("../private/onrequest.js");
var Onconnect = require("../private/onconnect.js");

var rcounter = 0;
var ccounter = 0;

function onrequest (method, path, headers, body, callback) {
  var id = rcounter++;
  var name = this.__name__;
  var receptor = this.__receptor;
  console.log(name+"req#"+id+" "+method+" "+path+" "+JSON.stringify(headers)+" "+body);
  Onrequest(receptor, method, path, headers, body, function (status, reason, headers, body) {
    console.log(name+"res#"+id+" "+status+" "+reason+" "+JSON.stringify(headers)+" "+body);
    callback(status, reason, headers, body);
  });
}

function onconnect (path, con) {
  var id = ccounter++;
  console.log(name+"con#"+id+" "+path);
  Onconnect(this.__receptor__, path, LogSocket(con, this.__name__+"con#"+id));
}

module.exports = function (name) {
  var self = Object.create(Prototype);
  self.__onrequest__ = onrequest;
  self.__onconnect__ = onconnect;
  self.__receptor__ = receptor;
  self.__name__ = name || "";
  return self;
};

// Cyclical Dependency //
var Prototype = require("./index.js");