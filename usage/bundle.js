(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
// even if the process is looping afterward.

module.exports = function (host, secure) {
  secure = secure ? "s" : "";
  return {
    ws: function (path) { return new WebSocket("ws"+secure+"://"+host+path) },
    http: function (method, path, headers, body, callback) {
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

},{"./parse-headers.js":2}],2:[function(require,module,exports){

module.exports = function (lines) {
  var headers = {};
  for (var i=1, l=lines.length; i<l; i++) {
    var index = lines[i].indexOf(": ");
    if (index !== -1) {
      headers[lines[i].substring(0, index).toLowerCase()] = lines[i].substring(index+2);
    }
  }
  return headers;
};

},{}],3:[function(require,module,exports){
var Client = require("client-uniform/browser.js");
// Asynchronous HTTP request to www.example.com:80
Client("www.example.com", false).http("GET", "/foo", {}, null, function (error, response) {
  if (error)
    throw error;
  console.log(response);
});
// Synchronous HTTPS request to www.example.com:443
console.log(Client("www.example.com", true).http("GET", "/foo", {}, null));
},{"client-uniform/browser.js":1}]},{},[3]);
