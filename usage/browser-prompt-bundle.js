(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var UserSync = require("./lib/user-sync.js");
module.exports = UserSync(prompt);
},{"./lib/user-sync.js":5}],2:[function(require,module,exports){

module.exports = function (response) {
  var headersbody = response.split("\r\n\r\n", 2);
  if (headersbody.length !== 2)
    return [new Error("The response does not contain \"\\r\\n\\r\\n\":\n"+response)];
  var lines = headersbody[0].split("\r\n");
  if (lines.length === 0)
    return [new Error("Cannot find the status line in:\n"+response)];
  var headers = {};
  for (var i=1, l=lines.length; i<l; i++) {
    var binding = lines[i].split(": ", 2);
    headers[binding[0]] = binding[1];
  }
  var parts = /^HTTP\/1\.1 ([0-9][0-9][0-9]) /.exec(lines[0]);
  if (!parts)
    return [new Error("Unknown status line: "+lines[0])]
  return [null, Number(parts[1]), headers, headersbody[1]];
};

},{}],3:[function(require,module,exports){

module.exports = function (method, path, headers, body) {
  var lines = [method+" "+path+" HTTP/1.1"];
  for (var h in headers)
    lines.push(h+": "+headers[h]);
  return lines.join("\r\n")+"\r\n\r\n"+body;
};

},{}],4:[function(require,module,exports){
var PrintRequest = require("./print-request.js");
var ParseResponse = require("./parse-response.js");
module.exports = function (sync) {
  return function (url) {
    var parts = url.split("//", 2);
    var protocol = parts[0];
    var parts = parts[1].split("/", 2);
    var host = parts[0];
    var prefix = parts[1] ? "/"+parts[1] : "";
    return function (method, path, headers, body, callback) {
      headers.host = host;
      var result = ParseResponse(sync(protocol, PrintRequest(method, prefix+path, headers, body)));
      if (callback)
        setTimeout(callback, 0, result[0], result[1], result[2], result[3]);
      else
        return result;
    };
  };
};

},{"./parse-response.js":2,"./print-request.js":3}],5:[function(require,module,exports){
var RawSync = require("./raw-sync.js");
var ParseResponse = require("./parse-response.js");
module.exports = function (ask) {
  return RawSync(function (protocol, request) {
    return JSON.parse(ask("Please enter the JSON-encoded response (e.g. \"HTTP/1.1 200 OK\\r\\n\\r\\n\") to:\n"+request));
  });
};

},{"./parse-response.js":2,"./raw-sync.js":4}],6:[function(require,module,exports){

var RequestUniform = require("request-uniform/browser-prompt.js");
var request = RequestUniform("http://www.example.com/foo");
request("GET", "/bar", {}, "", console.log);
console.log(request("GET", "/bar", {}, ""));

},{"request-uniform/browser-prompt.js":1}]},{},[6]);
