
var Prototype = require("../prototype");

function onrequest (method, reason, headers, body, callback) {
  this.__output__.write(method+" "+reason+" "+JSON.stringify(headers)+" "+body+"\n");
  callback(200, "ok", {}, "");
}

function onconnect (path, con) {
  var self = this;
  con.on("message", function (message) {
    self.__output__.write(path+" >> "+message+"\n");
  });
}

module.exports = function (output) {
  var self = Object.create(Prototype);
  self.__output__ = output;
  self.__onrequest__ = onrequest;
  self.__onconnect__ = onconnect;
  return self;
};
