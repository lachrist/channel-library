
var ParseHeaders = require("./parse-headers.js");

// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send

// The XMLHttpRequest.send() method sends the request.
// If the request is asynchronous (which is the default),
// this method returns as soon as the request is sent.
// If the request is synchronous, this method doesn't
// return until the response has arrived. send() accepts
// an optional argument for the request body. If the
// request method is GET or HEAD, the argument is ignored
// and request body is set to null.

// This seems to indicate that the request will be send
// even if we do not resume to the event loop afterward.

module.exports = function (host, secure) {
  secure = secure ? "s" : "";
  return {
    websocket: function (path) { return new WebSocket("ws"+secure+"://"+host+path) },
    request: function (method, path, headers, body, callback) {
      var req = new XMLHttpRequest();
      req.open(method, "http"+secure+"://"+host+path, Boolean(callback));
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
      if (typeof callback === "function") {
        req.addEventListener("error", callback);
        req.addEventListener("load", function () {
          callback(null, {
            status: req.status,
            reason: req.statusText,
            headers: ParseHeaders(req.getAllResponseHeaders().split("\r\n")),
            body: req.responseText
          });
        });
      }
    }
  };
};
