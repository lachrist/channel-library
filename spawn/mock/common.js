
var EmitterMock = require("antena/emitter/mock.js");
var Stream = require("stream");
var Console = require("../util/console.js");
var Terminate = require("../util/terminate.js");

function run (script, mock) {
  var main = Function(script, "process", "console");
  try {
    main(mock, Console(mock.stdout));
  } catch (error) {
    mock.stderr.write(error && "stack" in error ? error.stack : ""+error+"\n");
  }
}

function pair () {
  var readable = new Stream.Readable();
  var writable = new Stream.Writable({
    decodeStrings: false,
    write: function (chunk, encoding, callback) {
      readable.push(chunk, encoding);
      callback();
    }
  });
  readable.setEncoding("utf8");
  writable.setDefaultEncoding("utf8");
  return {readable:readable, writable:writable};
}

module.exports = function (load) {
  return function (source, argv, receptor) {
    var child = new Events();
    var mock = new Events();
    (function (stdin) {
      child.stdin = stdin.writable;
      mock.stdin = stdin.readable;
    } (pair()));
    (function (stdout) {
      child.stdout = stdout.writable;
      mock.stdout = stdout.writable;
    } (pair()));
    (function (stderr) {
      child.stderr = stderr.writable;
      mock.stderr = stdout.writable;
    } ());
    child.send = function (message) { mock.emit("message", JSON.parse(JSON.stringify(message))) };
    mock.send = function (message) { child.emit("message", JSON.parse(JSON.stringify(message))) };
    child.kill = function (signal) { Terminate(child, null, signal) };
    mock.exit = function (code) { Terminate(child, code, signal) };
    child.stdio = [child.stdin, child.stdout, child.stderr];
    mock.emitter = EmitterMock(receptor);
    source = typeof source === "string" ? {path:source} : source;
    mock.argv = ["mock", source.path||null].concat(argv||[]);
    if (source.content) {
      setTimeout(0, run, source.content, mock);
    } else {
      load(source.path, function (error, content) {
        if (error)
          return child.emit("error", error);
        run(content, autoclose, mock);
      });
    }
    return child;
  };
};
