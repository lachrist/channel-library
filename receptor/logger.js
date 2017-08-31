
var Factory = require("./factory");

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
  return Factory({
    __output__: output,
    __onrequest__: onrequest,
    __onconnect__: onconnect
  });
};
