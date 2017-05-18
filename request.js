
var Http = require("http");
var Https = require("https");
var ParseResponse = require("./parse-response.js");
var ChildProcess = require("child_process");

var emit = ChildProcess.fork(__dirname+"/emit.js", {stdio: ["ignore", "inherit", "inherit", "ipc"]});

module.exports = function (host, secure) {
  return function (method, path, headers, body, callback) {
    if (!callback) {
      var args = ["--request", method, "--include", "--silent"];
      if (body)
        args.push("--data-binary", "@-");
      for (var h in headers)
        args.push("--header", h+": "+headers[h]);
      if (host.unix)
        args.push("--unix-socket", host.unix, "http"+secure+"://localhost"+path);
      else if (host.port)
        args.push("http"+secure+"://"+host.hostname+":"+host.port+path);
      else
        args.push("http"+secure+"://"+host.hostname+path);
      var result = ChildProcess.spawnSync("curl", args, {input:body||"", encoding:"utf8"});
      if (result.error)
        throw result.error;
      if (result.status !== 0)
        throw new Error("curl "+args.join(" ")+" failed with: "+result.status+" "+result.stderr);
      return ParseResponse(result.stdout);
    }
    var options = {
      secure: secure,
      method: method,
      hostname: host.hostname,
      port: host.port,
      socketPath: host.unix,
      headers: headers,
      path: path,
      body: body
    };
    if (typeof callback !== "function") 
      return emit.send(options);
    var req = (secure?Https:Http).request(options, function (res) {
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
    });
    req.on("error", callback);
    req.end(body, "utf8");
    // if (body)
    //   req.end(body, "utf8");
    // else
    //   req.end();
  };
};
