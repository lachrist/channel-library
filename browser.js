
var ParseHeaders = require("./parse-headers.js");

module.exports = function (method, url, headers, body, callback) {
  method = method || "GET";
  url = typeof url === "string" ? url : url.protocol+"//"+url.hostname+":"+url.port+url.path;
  headers = headers || {};
  var req = new XMLHttpRequest();
  req.open(method, url, Boolean(callback));
  for (var name in headers)
    req.setRequestHeader(name, headers[name]);
  req.send(body);
  if (!callback) {
    return {
      status: req.status,
      reason: req.statusText,
      headers: ParseHeaders(req.getAllResponseHeaders().split("\r\n")),
      body: req.responseText
    };
  }
  req.addEventListener("error", callback);
  req.addEventListener("load", function () {
    callback(null, {
      status: req.status,
      reason: req.statusText,
      headers: ParseHeaders(req.getAllResponseHeaders().split("\r\n")),
      body: req.responseText
    });
  });
};
