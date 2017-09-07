
var Pathof = require("../util/pathof.js");

module.exports = function (req, res) {
  var self = this;
  var body = "";
  req.on("data", function (data) { body += data });
  req.on("end", function () {
    Onrequest(self, req.method, Pathof(req.url), req.headers, body, function (status, reason, headers, body) {
      res.writeHead(status, reason, headers);
      res.end(body);
    });
  });
};
