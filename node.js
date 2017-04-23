
var Http = require("http");
var Url = require("url");
var ChildProcess = require("child_process");
var ParseResponse = require("./lib/parse-response.js");

// options: {
//   protocol: "http[s]:",
//   hostname: "localhost",
//   port: 8080
//   socket: "/path/to/socket",
//   prefix: "/foo/bar"
// }
module.exports = function (options) {
  if (typeof options === "string") {
    options = Url.parse(options);
    options.prefix = options.path;
  }
  options.prefix = options.prefix || "";
  return function (method, path, headers, body, callback) {
    if (callback) {
      Http.request({
        protocol: options.protocol,
        hostname: options.hostname,
        port: options.port,
        socketPath: options.socket,
        method: method,
        path: options.prefix + path,
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
      if ("socket" in options)
        args.push("--unix-socket", options.socket, options.protocol+"//localhost"+options.prefix+path);
      else
        args.push(options.protocol+"//"+options.hostname+":"+options.port+options.prefix+path);
      var result = ChildProcess.spawnSync("curl", args, {input:body, encoding:"utf8"});
      if (result.error)
        return [result.error];
      if (result.status !== 0)
        return [new Error("curl "+args.join(" ")+" failed with: "+result.status+" "+result.stderr)];
      return ParseResponse(result.stdout);
    }
  };
};
