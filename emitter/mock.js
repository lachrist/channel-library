
var Events = require("events");
var Prototype = require("./prototype");
var Onrequest = require("../receptor/private/onrequest.js");
var Onconnect = require("../receptor/private/onconnect.js");

function request (method, path, headers, body, callback) {
  /* https://github.com/abbr/deasync/issues/83 */
  if (!callback) {
    throw new Error([
      "Mock emitters cannot handle synchronous HTTP requests since it ",
      "would involve transforming asynchronous calls into synchronous ",
      "calls. This is made difficult/impossible on purpose since doing ",
      "so would break the run-to-completion semantic. There is a module ",
      "called deasync which tries to circumvent this limitation but ",
      "it does not support nested calls ",
      "cf: https://github.com/abbr/deasync/issues/83."
    ].join(""));
  }
  setTimeout(Onrequest, 0, this.__receptor__, method, this.__prefix__+path, headers, body, function (status, reason, headers, body) {
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
  setTimeout(Onconnect, 0, this.__receptor__, this.__prefix__+path, con2);
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
  var self = Object.create(Prototype);
  self.request = request;
  self.connect = connect;
  self.__prefix__ = "";
  self.__receptor__ = receptor;
  return self;
};
