
module.exports = function (prototype) {
  return function (receptors) {
    var self = Object.create(prototype);
    self.__childs__ = receptors;
    self.__default__ = this;
    return self;
  };
};
