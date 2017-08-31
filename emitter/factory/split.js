
module.exports = function (splitters) {
  var emitters = {};
  for (var i=0; i<splitters.length; i++) {
    emitters[splitters[i]] = Object.assign({}, this);
    emitters[splitters[i]].__prefix__ += "/"+splitters[i];
  }
  return emitters;
};
