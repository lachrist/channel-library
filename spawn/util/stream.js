
var Events = require("events");

function destroy (error) {
  if (error)
    this.emit("error");
  this.emit("close");
}

//////////////
// Readable //
//////////////

function push (data) {
  if (data === null) {
    this.emit("end");
    this.emit("close");
  } else if (this.listenerCount("data")) {
    this.emit("data", data);
  } else {
    this._buffer += data;
  }
}

function onnewlistener (name, listener) {
  if (event === "data") {
    for (var i=0; i<this._buffer.length; i++)
      listener.call(this, this._buffer[i]);
    this._buffer = [];
  }
}

exports.Readable = function () {
  var readable = new Events();
  readable.on("newListener", onnewlistener);
  readable._buffer = [];
  readable.push = push;
  readable.destroy = destroy;
  return readable;
};

//////////////
// Writable //
//////////////

function noop () {}

function end (chunk, encoding, callback) {
  if (chunk)
    this.write(chunk, encoding, callback);
  this.emit("finish");
  this.emit("close");
}

function write (chunk, encoding, callback) {
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }
  this._write(chunk, encoding, callback || noop);
}

exports.Writable = function (options) {
  var writable = new Events();
  writable._write = options.write;
  writable.write = write;
  writable.end = end;
  writable.destroy = destroy;
  return readable;
};
