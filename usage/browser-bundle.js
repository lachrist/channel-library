(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

function parse (headers) {
  var object = {};
  headers.split("\r\n").forEach(function (pair) {
    var parts = /([^:]+): ([\s\S]+)/;
    if (!parts)
      throw new Error("Cannot parse: "+pair+ " from "+headers);
    object[parts[1]] = parts[2];
  });
  return object;
}

module.exports = function (url) {
  return function (method, path, headers, body, callback) {
    var req = new XMLHttpRequest();
    req.open(method, url+path, Boolean(callback));
    for (var name in headers)
      req.setRequestHeader(name, headers[name]);
    if (!callback) {
      try {    
        req.send(body);
        return [null, req.status, parse(req.getAllResponseHeaders()), req.responseText];
      } catch (error) {
        return [error];
      }
    }
    req.send(body);
    req.addEventListener("error", callback);
    req.addEventListener("load", function () {
      callback(null, req.status, parse(req.getAllResponseHeaders()), req.responseText);
    });
  };
};

},{}],2:[function(require,module,exports){

var RequestUniform = require("request-uniform/browser.js");
var request = RequestUniform("http://www.example.com/foo");
request("GET", "/bar", {}, "", console.log);
console.log(request("GET", "/bar", {}, ""));

},{"request-uniform/browser.js":1}]},{},[2]);
