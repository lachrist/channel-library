
var Ws = require("ws");
var HttpNode = require("./http-node.js");

module.exports = function (host, secure) {
  secure = secure ? "s" : "";
  return {
    http: HttpNode(host, secure),
    socket: (host.indexOf("/") === -1)
      ? function (path) { return new Ws("ws"+secure+"://"+host+path) }
      : function (path) { return new Ws("ws"+secure+"+unix://"+host+":"+path) }
  };
};
