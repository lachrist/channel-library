
var Events = require("events");
var ParseHeaders = require("../common/parse-headers.js");
var Factory = require("./factory");

function request (method, path, headers, body, callback) {
  var req = new XMLHttpRequest();
  req.open(method, this.__rprefix__+this.__prefix__+path, Boolean(callback));
  for (var name in headers)
    req.setRequestHeader(name, headers[name]);
  req.send(body);
  if (!callback) {
    var headers = ParseHeaders(req.getAllResponseHeaders().split("\r\n"));
    return [req.status, req.statusText, headers, req.responseText];
  }
  req.addEventListener("error", callback);
  req.addEventListener("load", function () {
    var headers = ParseHeaders(req.getAllResponseHeaders().split("\r\n"));
    callback(null, req.status, req.statusText, headers, req.responseText);
  });
}

function send (message) {
  this.__inner__.send(message);
}

function close (code, reason) {
  this.__inner__.close(code, reason);
}

function connect (path) {
  var wrapper = new Events();
  wrapper.close = close;
  wrapper.send = send;
  wrapper.__inner__ = new WebSocket(this.__cprefix__+this.__prefix__+path);
  wrapper.__inner__.onopen = function () {
    wrapper.emit("open");
  };
  wrapper.__inner__.onclose = function (event) {
    wrapper.emit("close", event.code, event.reason);
  };
  wrapper.__inner__.onmessage = function (event) {
    wrapper.emit("message", event.data);
  };
  return wrapper;
}

module.exports = function (host, secure) {
  host = host || location.host;
  secure = (location.origin.indexOf("https://") === 0 || secure) ? "s" : "";
  return Factory({
    connect: connect,
    request: request,
    __prefix__:  "",
    __cprefix__: "ws"+secure+"://"+host,
    __rprefix__: "http"+secure+"://"+host
  });
};
