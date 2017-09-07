0
var Ws = require("ws");
var Url = require("url");
var Onrequest = require("./private/onrequest.js");
var Onconnect = require("./private/onconnect.js");

module.exports = function (self, server) {
  var ws = new Ws.Server({noServer:true});
  server.on("request", function (req, res) {
    var body = "";
    req.on("data", function (data) { body += data });
    req.on("end", function () {
      Onrequest(self, req.method, Url.parse(req.url).path, req.headers, body, function (status, reason, headers, body) {
        res.writeHead(status, reason, headers);
        res.end(body);
      });
    });
  });
  server.on("upgrade", function (req, socket, head) {
    ws.handleUpgrade(req, socket, head, function (con) {
      Onconnect(self, Url.parse(req.url).path, con);
    });
  });
};
