var PrintRequest = require("./print-request.js");
var ParseResponse = require("./parse-response.js");
module.exports = function (sync) {
  return function (url) {
    var parts = url.split("//", 2);
    var protocol = parts[0];
    var parts = parts[1].split("/", 2);
    var host = parts[0];
    var prefix = parts[1] ? "/"+parts[1] : "";
    return function (method, path, headers, body, callback) {
      headers.host = host;
      var result = ParseResponse(sync(protocol, PrintRequest(method, prefix+path, headers, body)));
      if (callback)
        setTimeout(callback, 0, result[0], result[1], result[2], result[3]);
      else
        return result;
    };
  };
};
