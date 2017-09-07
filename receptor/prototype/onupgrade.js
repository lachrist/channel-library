
var Pathof = require("../util/pathof.js");

if (typeof window === "undefined") {
  var ws = new require("w"+"s").Server({noServer:true});
}

module.exports = function (req, socket, head) {
  var self = this;
  ws.handleUpgrade(req, socket, head, function (con) {
    Onconnect(self, Pathof(req.url), con);
  });
};
