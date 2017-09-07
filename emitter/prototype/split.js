
module.exports = function (splitters) {
  var emitters = {};
  for (var i=0; i<splitters.length; i++) {
    emitters[splitters[i]] = Object.create(Prototype);
    Object.assign(emitters[splitters[i]], this);
    emitters[splitters[i]].__prefix__ += "/"+splitters[i];
  }
  return emitters;
};

// Cyclical dependency //
var Prototype = require("./index.js");
