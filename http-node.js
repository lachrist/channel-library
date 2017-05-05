
var Http = require("http");
var Https = require("https");
var ParseResponse = require("./parse-response.js");
var ChildProcess = require("child_process");

var emit = ChildProcess.fork(__dirname+"/emit.js", {stdio: ["ignore", "inherit", "inherit", "ipc"]});

module.exports = function (host, secure) {
  if (host.indexOf("/")) {
    var unix = host;
    var host = "localhost";
  } else if (host.indexOf(":") !== -1) {
    var hostname = host.split(":")[0];
    var port = Number(host.split(":")[1]);
  } else {
    var hostname = host;
  }
  var protocol = secure ? Https : Http;
  return function (method, path, headers, body, callback) {
    if (!callback)
      var args = ["--request", method, "--include", "--silent"];
      if (body)
        args.push("--data-binary", "@-");
      for (var h in headers) {
        args.push("--header");
        args.push(JSON.stringify(h+": "+headers[h]));
      }
      if (unix)
        args.push("--unix-socket", unix);
      args.push("http"+secure+"://"+host+path);
      var result = ChildProcess.spawnSync("curl", args, {input:body, encoding:"utf8"});
      if (result.error)
        throw result.error;
      if (result.status !== 0)
        throw new Error("curl "+args.join(" ")+" failed with: "+result.status+" "+result.stderr);
      return ParseResponse(result.stdout);
    }
    var options = {
      secure: secure,
      method: method,
      hostname: hostname,
      port: port,
      socketPath: unix,
      headers: headers,
      path: path,
      body: body
    };
    if (typeof callback !== "function") 
      return emit.send(options);
    protocol.request(options, function (res) {
      var buffers = [];
      res.on("error", callback);
      res.on("data", function (buffer) { buffers.push(buffer) });
      res.on("end", function () {
        callback(null, {
          status: res.statusCode,
          reason: res.statusMessage,
          headers: res.headers,
          body: Buffer.concat(buffers).toString("utf8")
        });
      });
    }).on("error", callback).end(body, "utf8");
  };
