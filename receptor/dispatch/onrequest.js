
module.exports = function onrequest (receptor, method, path, headers, body, callback) {
  var segments = path.split("/");
  segments.shift();
  while (true) {
    if (receptor.__onrequest__)
      return receptor.__onrequest__(method, "/"+segments.join("/"), headers, body, callback);
    receptor = (segments[0] in receptor.__childs__) ? receptor.__childs__[segments.shift()] : receptor.__default__;
  }
};
