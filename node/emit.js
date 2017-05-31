
var Http = require("http");
var Https = require("https");

process.on("message", function (message) {
  var req = (message.secure?Https:Http).request(message);
  req.on("error", function (error) {
    message.error = error.message;
    process.stderr.write("Emit error: "+JSON.stringify(message, null, 2)+"\n");
  });
  req.on("response", function (res) {
    if (res.statusCode !== 200 && res.statusCode !== 100) {
      message.error = res.statusCode+" ("+res.statusMessage+")";
      process.stderr.write("Emit error: "+JSON.stringify(message, null, 2)+"\n");
    }
  });
  req.end(message.body);
});
