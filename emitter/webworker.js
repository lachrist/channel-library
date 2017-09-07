
var Pool = require("../common/pool.js");
var Prototype = require("./prototype");

function request (method, path, headers, body, callback) {
  if (!callback) {
    this.__views__.lock[0] = 1;
    this.__post__({
      name: "sync",
      method: method,
      path: path,
      headers: headers,
      body: body
    });
    while (this.__views__.lock[0]);
    if (this.__views__.length[0] > this.__views__.data.length)
      throw new Error("Response too long for "+method+" "+path);
    var data = JSON.parse(String.fromCharCode.apply(null, this.__views__.data.slice(0, this.__views__.length[0])));;
    return [data.status, data.reason, data.headers, data.body];
  }
  for (var i=0; i<=this.__callbacks__.length; i++) {
    if (!this.__callbacks__[i]) {
      this.__callbacks__[i] = callback;
      return this.__post__({
        name: "async",
        index: i,
        method: method,
        path: path,
        headers: headers,
        body: body
      });
    }
  }
}

function connect (path) {
  var index = this.__pool__free__();
  this.__post__({
    name: "open",
    path: path,
    index: index
  });
  return this.__pool__add__(index);
}

var created = false;

module.exports = function (size) {
  if (created)
    throw new Error("Only one webworker emitter can be created...");
  created = true;
  var callbacks = [];
  var pool = Pool(global.postMessage);
  var handlers = {
    close: pool.onclose,
    message: pool.onmessage,
    open: pool.onopen,
    async: function (data) {
      callbacks[index](null, data);
      delete callbacks[index];
    }
  };
  global.onmessage = function (message) {
    handlers[message.data.name](message.data)
  };
  var shared = new SharedArrayBuffer(2*(size||1024)+8);
  global.postMessage(shared);
  var views = {};
  views.lock = new Uint8Array(shared, 0, 1);
  views.length = new Uint32Array(shared, 4, 1);
  views.data = new Uint16Array(shared, 8);
  var self = Object.create(Prototype);
  self.request = request;
  self.connect = connect;
  self.__prefix__ = "";
  self.__post__ = global.postMessage;
  self.__callbacks__ = callbacks;
  self.__views__ = views;
  self.__pool__add__ = pool.add;
  self.__pool__free__ = pool.free;
  return self;
};
