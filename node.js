
var Ws = require("ws");
var Request = require("./request.js");
var ParseHost = require("./parse-host.js");

module.exports = function (host, secure) {
  var host = ParseHost(host);
  secure = secure ? "s" : "";
  if (host.unix)
    var prefix = "ws"+secure+"+unix://"+host.unix+":";
  else if (host.port)
    var prefix = "ws"+secure+"://"+host.hostname+":"+host.port;
  else
    var prefix = "ws"+secure+"://"+host.hostname;
  return {
    websocket: function (path) { return new Ws(prefix+path) },
    request: Request(host, secure)
  };
};
