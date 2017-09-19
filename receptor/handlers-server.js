
var Ws = require("ws");
var Onrequest = require("./dispatch/onrequest.js");
var Onconnect = require("./dispatch/onconnect.js");

function pathof (url) {
  var index = url.indexOf("/");
  return index === -1 ? "" : url.substring(index);
}

module.exports = function (receptor) {
  var ws = new Ws.Server({noServer:true});
  return {
    request: function (req, res) {
      var body = "";
      req.on("data", function (data) { body += data });
      req.on("end", function () {
        Onrequest(receptor, req.method, pathof(req.url), req.headers, body, function (status, reason, headers, body) {
          res.writeHead(status, reason, headers);
          res.end(body);
        });
      });
    },
    upgrade: function (req, socket, head) {
      ws.handleUpgrade(req, socket, head, function (con) {
        Onconnect(receptor, pathof(req.url), con);
      });
    }
  }
};
