
var Events = require("events");
var Stream = require("stream");
var Receptor = require("../../receptor");
var Handlers = require("../../receptor/handlers-browser");
var Terminate = require("../util/terminate.js");

function write (data) { this.emit("data", data) }

module.exports = function (source, argv, receptor) {
  var child = new Events();
  var buffers = {io:[], ipc:[]};
  var cons = {
    io: { send: function (message) { buffers.io.push(message) } },
    ipc: { send: function (message) { buffers.ipc.push(message) } }
  };
  child.send = function (json) { cons.ipc.send(JSON.stringify(json)) };
  child.stdin = new Stream.Writable({
    decodeStrings: false,
    write: function (chunk, encoding, callback) {
      cons.io.send(chunk.toString(encoding), callback);
    }
  });
  child.stdout = new Stream.Readable({
    encoding: "utf8",
    read: function (size) {}
  });
  child.stderr = new Stream.Readable({
    encoding: "utf8"
    read: function (size) {}
  });
  // child.stdin.setDefaultEncoding("utf8");
  // child.stdout.setEncoding("utf8");
  // child.stdout.setEncoding("utf8");
  child.stdio = [child.stdin, child.stdout, child.stderr];
  var worker = new Worker(TEMPLATE_CHILD_URL);
  var handlers = Handlers(Receptor({}).merge({
    user: receptor,
    antena: Receptor({
      onrequest: function (method, path, headers, body, callback) {
        if (path === "/begin")
          return callback(200, "ok", {}, JSON.stringify({
            source: typeof source === "string" ? {path:source} : source, 
            argv: argv || []
          }));
        if (path === "/end")
          return terminate(JSON.parse(body), null);
        callback(400, "invalid-path", {}, "");
      },
      onconnect: function (path, con) {
        if (path === "/io") {
          cons.io = con;
          con.on("message", function (message) { child.stdout.push(message) });
          buffers.io.forEach(function (message) { con.send(message) });
          buffers.io = null;
        } else if (path === "/err") {
          cons.err = con;
          con.on("message", function (message) { child.stderr.push(message) });
        } else if (path === "/ipc") {
          cons.ipc = con;
          con.on("message", function (message) { child.emit("message", JSON.parse(message)) });
          buffers.ipc.forEach(function (message) { con.send(message) });
          buffers.ipc = null;
        } else {
          con.close(4000, "invalid-path");
        }
      }
    })
  }), function (message) { worker.postMessage(message) });
  worker.onmessage = handlers.message;
  worker.onerror = function (error) {
    child.stderr.push(error && "stack" in error ? error.stack : ""+error+"\n");
  };
  function terminate (code, signal) {
    handlers.terminate();
    Terminate(child, code, signal);
  }
  child.kill = function (signal) { terminate(null, signal) };
  return child;
};
