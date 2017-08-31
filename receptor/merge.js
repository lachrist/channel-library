
var Factory = require("./factory");

module.exports = function (receptors) {
  return Factory({
    __childs__: receptors
  });
};
