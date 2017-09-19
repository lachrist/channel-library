
var WebworkerSocketPool = require("../util/webworker-socket-pool.js");
var Prototype = require("./prototype");

function request (method, path, headers, body, callback) {
  var copy = {};
  for (var key in headers)
    copy[key] = ""+headers[key];
  if (!callback) {
    this._views.lock[0] = 1;
    postMessage({
      name: "sync",
      method: ""+method,
      path: this._prefix+path,
      headers: copy,
      body: ""+body
    });
    while (this._views.lock[0]);
    if (this._views.length[0] > this._views.data.length)
      throw new Error("Response too long for "+method+" "+path);
    var data = JSON.parse(String.fromCharCode.apply(null, this._views.data.slice(0, this._views.length[0])));;
    return [data.status, data.reason, data.headers, data.body];
  }
  for (var i=0; i<=this._callbacks.length; i++) {
    if (!this._callbacks[i]) {
      this._callbacks[i] = callback;
      return postMessage({
        name: "async",
        index: i,
        method: ""+method,
        path: this._prefix+path,
        headers: copy,
        body: body
      });
    }
  }
}

function connect (path) {
  var index = this._poolfree();
  postMessage({
    name: "open",
    path: this._prefix+path,
    index: index
  });
  return this._pooladd(index);
}

var singleton = false;

module.exports = function (size) {
  if (singleton)
    throw new Error("Only one webworker emitter can be created...");
  singleton = true;
  var callbacks = [];
  var pool = WebworkerSocketPool(postMessage);
  var handlers = {
    close: pool.onclose,
    message: pool.onmessage,
    open: pool.onopen,
    async: function (data) {
      callbacks[data.index](null, data.status, data.reason, data.headers, data.body);
      delete callbacks[data.index];
    }
  };
  onmessage = function (message) {
    handlers[message.data.name](message.data)
  };
  var shared = new SharedArrayBuffer(2*(size||1024)+8);
  postMessage(shared);
  var views = {};
  views.lock = new Uint8Array(shared, 0, 1);
  views.length = new Uint32Array(shared, 4, 1);
  views.data = new Uint16Array(shared, 8);
  var self = Object.create(Prototype);
  self.request = request;
  self.connect = connect;
  self._prefix = "";
  self._callbacks = callbacks;
  self._views = views;
  self._pooladd = pool.add;
  self._poolfree = pool.free;
  return self;
};
