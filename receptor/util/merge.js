
var Prototype = require("../prototype");

module.exports = function (receptors) {
  var self = Object.create(Prototype);
  self.__childs__ = receptors;
  return self;
};
