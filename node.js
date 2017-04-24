
var Http = require("http");
var Url = require("url");
var ChildProcess = require("child_process");
var ParseHeaders = require("./parse-headers.js");

function parse (response) {
  var index = response.indexOf("\r\n\r\n");
  if (index === -1)
    throw new Error("Cannot extract the header from:\n"+response);
  var lines = response.substring(0, index).split("\r\n");
  if (lines.length === 0)
    throw new Error("Cannot extract the status line from:\n"+response);
  var parts = /^HTTP\/1\.1 ([0-9][0-9][0-9]) (.*)$/.exec(lines[0]);
  lines.splice(0, 1);
  if (!parts)
    throw new Error("Invalid status line: "+lines[0]);
  return {
    status: Number(parts[1]),
    reason: parts[2],
    headers: ParseHeaders(lines),
    body: response.substring(index+4)
  };
};

// options: {
//   protocol: "http[s]:",
//   hostname: "localhost",
//   port: 8080
//   socket: "/path/to/socket",
//   path: "/foo/bar?buz=quz"
// }
module.exports = function (method, options, headers, body, callback) {
  method = method || "GET";
  options = typeof options === "string" ? Url.parse(options) : options;
  headers = headers || {};
  if (callback) {
    options.method = method || "GET";
    options.headers = headers || {};
    options.socketPath = options.socket;
    (options.protocol === "https:" ? Https : Http).request(options, function (res) {
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
      args.push("--unix-socket", options.socket, options.protocol+"//localhost"+options.path);
    else
      args.push(options.protocol+"//"+options.hostname+":"+options.port+options.path);
    var result = ChildProcess.spawnSync("curl", args, {input:body, encoding:"utf8"});
    if (result.error)
      throw result.error;
    if (result.status !== 0)
      throw new Error("curl "+args.join(" ")+" failed with: "+result.status+" "+result.stderr);
    return parse(result.stdout);
  }
};
