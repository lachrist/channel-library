
var Stream = require("stream");

module.exports = function (method, path, headers, body) {
  var req = new Stream.readable();
  req.method = method;
  req.url = path;
  req.headers = headers;
  req.push(body);
  req.push(null);
  return req;
};
