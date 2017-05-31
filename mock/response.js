
var Stream = require("stream");

function hasHeader (name) { return name in this._headers }
function getHeader (name) { return this._headers[name] }
function setHeader (name, value) { this._headers[name] = value }
function getHeaders () {
  var copy = {};
  for (var name in this._headers)
    copy[name] = this._headers[name];
  return copy;
}
function writeHead (status, reason, headers) {
  this.statusCode = status || this.statusCode;
  this.statusMessage = reason || this.statusMessage;
  headers = headers || {};
  for (var name in headers) {
    this._headers[name] = headers[name];
  }
}
function write (chunk, encoding, callback) {
  this._body += chunk;
  callback(); 
}

module.exports = function (callback) {
  var res = new Stream.Writable({write:write});
  res.statusCode = 200;
  res.statusMessage = "ok";
  res._headers = {};
  res._body = "";
  res.hasHeader = hasHeader;
  res.getHeader = getHeader;
  res.setHeader = setHeader;
  res.getHeaders = res.getHeaders;
  res.writeHead = writeHead;
  res.on("error", callback);
  res.on("finish", function () {
    callback(null, {
      status: res.statusCode,
      reason: res.statusMessage,
      headers: res._headers,
      body: res._body
    });
  });
  return res;
};
