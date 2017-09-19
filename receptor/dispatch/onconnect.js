
module.exports = function (receptor, path, con) {
  var segments = path.split("/");
  segments.shift();
  while (true) {
    if (receptor.__onconnect__)
      return receptor.__onconnect__("/"+segments.join("/"), con);
    receptor = (segments[0] in receptor.__childs__) ? receptor.__childs__[segments.shift()] : receptor.__default__;
  }
};
