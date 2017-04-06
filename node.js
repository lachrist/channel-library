
var Http = require("http");
var Url = require("url");
var ChildProcess = require("child_process");
var ParseResponse = require("./lib/parse-response.js");

module.exports = function (url) {
  var parts = Url.parse(url);
  if (!parts.protocol)
    var socket = url;
  return function (method, path, headers, body, callback) {
    if (callback) {
      Http.request({
        protocol: socket ? "http:" : parts.protocol,
        hostname: socket ? undefined : parts.hostname,
        port: socket ? undefined : parts.port,
        socketPath: socket,
        method: method,
        path: (socket ? "" : parts.path) + path,
        headers: headers
      }).on("response", function (res) {
        var buffers = [];
        res.on("error", callback);
        res.on("data", function (buffer) { buffers.push(buffer) });
        res.on("end", function () {
          callback(null, res.statusCode, res.headers, Buffer.concat(buffers).toString("utf8"));
        });
      }).on("error", callback).end(body, "utf8");
    } else {
      var args = [
        "--request", method,     // http method
        "--data-binary", "@-",   // data from stdin
        "--include",             // headers in stdout
        "--silent"               // no progress information
      ];
      for (var h in headers) {
        args.push("--header");
        args.puhs(JSON.stringify(h+": "+headers[h]));
      }
      if (socket)
        args.push("--unix-socket", socket, path);
      else
        args.push(url+path);
      var result = ChildProcess.spawnSync("curl", args, {input:body, encoding:"utf8"});
      if (result.error)
        return [result.error];
      if (result.status !== 0)
        return [new Error("curl "+args.join(" ")+" failed with: "+result.status+" "+result.stderr)];
      return ParseResponse(result.stdout);
    }
  };
};
