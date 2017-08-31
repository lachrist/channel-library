
module.exports = function (emitter) {
  emitter.split = Split;
  emitter.trace = Trace;
  return emitter;
};

// Cyclical dependencies //
var Split = require("./split.js");
var Trace = require("./trace.js");
