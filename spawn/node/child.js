
var EmitterNode = require("../../emitter/node");

process.on("message", function (message) {
  process.removeAllListeners("messsage");
  process.emitter = EmitterNode(message.port, false);
  process.argv = ["node", message.path].concat(message.argv);
  message.script ? global.eval(message.content) : require(message.path);
});
