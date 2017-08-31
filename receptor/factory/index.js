
module.exports = function (receptor) {
  receptor.attach = Attach;
  receptor.trace = Trace;
  receptor.webworker = Webworker;
  return receptor;
};

// Cyclical dependencies //
var Attach = require("./attach.js");
var Trace = require("./trace.js");
var Webworker = require("./webworker.js");
