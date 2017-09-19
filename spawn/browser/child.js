
var EmitterWebworker = require("../../emitter/webworker");
var Events = require("events");
var Stream = require("../util/stream.js");
var Console = require("../util/console.js");

var emitters = EmitterWebworker().split(["antena", "user"]);
var mock = new Events();
global.process = mock;
mock.exit = function (code) { emitters.antena.request("GET", "/end", {}, JSON.stringify(code)) }
var counter = 0;

(function (con) {
  counter++;
  con.on("open", function () {
    mock.stdin = new Stream.Readable();
    mock.stdin.setEncoding("utf8");
    con.on("message", function (message) { mock.stdin.push(message, "utf8") });
    mock.stdout = new Stream.Writable({
      decodeStrings: false,
      write: function (chunk, encoding, callback) { con.send(chunk.toString(encoding), callback) }
    });
    mock.stdout.setDefaultEncoding("utf8");
    global.console = Console(mock.stdout);
  });
} (emitters.antena.connect("/io")));

(function (con) {
  counter++;
  con.on("open", function () {
    mock.stderr = new Stream.Writable({
      decodeStrings: false,
      write: function (chunk, encoding, callback) { con.send(chunk.toString(encoding), callback) } 
    });
    mock.stderr.setDefaultEncoding("utf8");
    ready();
  });
} (emitters.antena.connect("/err")));

(function (con) {
  counter++
  con.on("open", function () {
    con.on("message", function (message) { mock.emit("message", JSON.parse(message)) });
    mock.send = function (message, callback) { con.send(JSON.stringify(message), callback) };
    ready();
  });
} (emitters.antena.connect("/ipc")));

function ready () {
  if (!--counter) {
    emitters.antena.request("GET", "/begin", {}, "", function (error, status, reason, header, body) {
      if (error || status !== 200)
        throw error || new Error(status+" "+reason);
      var data = JSON.parse(body);
      mock.argv = ["browser", data.source.path].concat(data.argv);
      if (data.source.content)
        return global.eval(data.source.content);
      var req = new XMLHttpRequest();
      req.open("GET", data.source.path);
      req.onload = function () {
        if (req.status !== 200)
          throw new Error("Cannot load "+source+": "+req.status+" "+req.statusText);
        global.eval(req.responseText);
      };
      req.send();
    });
  }
}
