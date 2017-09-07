
var Merge = require("./private/merge.js");
var Logger = require("./private/logger.js");
var Prototype = require("./prototype");

function onrequest (method, path, headers, body, callback) {
  callback(400, "no-handler", {}, "");
}

function onconnect (path, con) {
  con.close(4000, "no-handler");
}

module.exports = function (methods) {
  var self = Object.create(Prototype);
  self.__onrequest__ = methods.onrequest || onrequest;
  self.__onconnect__ = methods.onconnect || onconnect;
  return self;
};

module.exports.logger = Logger;
module.exports.merge = Merge;
