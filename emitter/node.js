
var Http = require("http");
var Https = require("https");
var ChildProcess = require("child_process");
var Ws = require("ws");
var ParseHost = require("../common/parse-host.js");
var ParseResponse = require("../common/parse-response.js");
var Prototype = require("./prototype");

function request (method, path, headers, body, callback) {
  if (!callback) {
    var args = ["--request", method, "--include", "--silent"];
    if (body)
      args.push("--data-binary", "@-");
    for (var h in headers)
      args.push("--header", h+": "+headers[h]);
    if (this.__host__.unix)
      args.push("--unix-socket", this.__host__.unix, this.__rprefix__+this.__prefix__+path);
    else
      args.push(this.__rprefix__+this.__prefix__+path);
    var result = ChildProcess.spawnSync("curl", args, {input:body||"", encoding:"utf8"});
    if (result.error)
      throw result.error;
    if (result.status !== 0)
      throw new Error("curl "+args.join(" ")+" failed with: "+result.status+" "+result.stderr);
    return ParseResponse(result.stdout);
  }
  this.__protocol__.request({
    method: method,
    hostname: this.__host__.hostname,
    port: this.__host__.port,
    socketPath: this.__host__.unix,
    headers: headers,
    path: path,
    body: body
  }).on("response", function (res) {
    var body = "";
    res.on("error", callback);
    res.on("data", function (data) { body += data });
    res.on("end", function () {
      callback(null, res.statusCode, res.statusMessage, res.headers, body);
    });
  }).on("error", callback).end(body, "utf8");
}

function connect (path) {
  return new Ws(this.__cprefix__+this.__prefix__+path);
}

module.exports = function (host, secure) {
  host = ParseHost(host);
  secure = secure ? "s" : "";
  if (host.unix) {
    var rprefix = "http"+secure+"://localhost";
    var cprefix = "ws"+secure+"+unix://"+host.unix+":";
  } else {
    var rprefix = "http"+secure+"://"+host.hostname+(host.port?":"+host.port:"");
    var cprefix = "ws"+secure+"://"+host.hostname+(host.port?":"+host.port:"");
  }
  var self = Object.create(Prototype);
  self.request = request;
  self.connect = connect;
  self.__prefix__ = "";
  self.__host__ = host;
  self.__rprefix__ = rprefix;
  self.__cprefix__ = cprefix;
  self.__protocol__ = secure ? Https : Http;
  return self;
};
