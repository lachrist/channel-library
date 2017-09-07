
module.exports = function (url) {
  var index = url.indexOf("/");
  return index === -1 ? "" : url.substring(index);
};
