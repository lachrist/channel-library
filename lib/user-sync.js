var RawSync = require("./raw-sync.js");
var ParseResponse = require("./parse-response.js");
module.exports = function (ask) {
  return RawSync(function (protocol, request) {
    return JSON.parse(ask("Please enter the JSON-encoded response (e.g. \"HTTP/1.1 200 OK\\r\\n\\r\\n\") to:\n"+request));
  });
};
