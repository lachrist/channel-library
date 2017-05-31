
var Request = require("./request.js");
var Response = require("./response.js");

module.exports = function (onrequest, onwebsocket) {
  return {
    request: function (method, path, headers, body, callback) {
      onrequest(Request(method, path, headers, body), Response(callback));
    },
    connect: function (path) {
      var ws1 = Websocket();
      ws1.url = location.origin+path;
      var ws2 = Websocket();
      ws2.upgradeReq = Request("GET", path, {
        Upgrade: "WebSocket",
        Connection: "Upgrade"
      }, null);
      setTimeout(function () {
        ws1._open(ws2);
        ws2._open(ws1);
        onwebsocket(ws2);
      }, 0);
      return ws1;
    };
  };
};
