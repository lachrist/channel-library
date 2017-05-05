(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var ParseHeaders = require("./parse-headers.js");

module.exports = function (method, host, path, headers, body, callback) {
  var req = new XMLHttpRequest();
  req.open(method, host+path, Boolean(callback));
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
var Request = require("request-uniform/browser.js");
Request("GET", "http://www.example.com", "/foo", {}, null, function (error, response) {
  if (error)
    throw error;
  console.log(response);
});
console.log(Request("GET", "https://www.example.com", "/foo", {}, null));
},{"request-uniform/browser.js":1}]},{},[3]);
