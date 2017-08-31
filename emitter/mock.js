
var Events = require("events");
var Factory = require("./factory");
var Onrequest = require("../common/onrequest.js");
var Onconnect = require("../common/onconnect.js");

function request (method, path, headers, body, callback) {
  // https://github.com/abbr/deasync/issues/83
  if (!callback)
    throw new Error("Local emitters cannot handle synchronous HTTP requests");
  setTimeout(Onrequest, 0, this.__receptor__, method, path, headers, body, function (status, reason, headers, body) {
    setTimeout(callback, 0, null, status, reason, headers, body);
  });
};

function connect (path) {
  var con1 = new Events();
  var con2 = new Events();
  con1.close = close;
  con2.close = close;
  con1.send = send;
  con2.send = send;
  con1.pair = con2;
  con2.pair = con1;
  setTimeout(Onconnect, 0, this.__receptor__, path, con2);
  setTimeout(con1.emit.bind(con1), 0, "open");
  return con1;
}

function close (code, reason) {
  this.emit("close", code, reason);
  var pair = this.pair;
  setTimeout(function () {
    pair.emit("close", code, reason);
  }, 0);
}

function send (message) {
  var pair = this.pair
  setTimeout(function () {
    pair.emit("message", message);
  }, 0);
}

module.exports = function (receptor) {
  return Factory({
    request: request,
    connect: connect,
    __receptor__: __receptor__
  });
};
