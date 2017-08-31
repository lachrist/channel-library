
module.exports = function onrequest (receptor, method, path, headers, body, callback) {
  var segments = path.split("/");
  segments.shift();
  while (receptor) {
    if (receptor.__onrequest__)
      return receptor.__onrequest__(method, "/"+segments.join("/"), headers, body, callback);
    receptor = receptor.__childs__[segments.shift()];
  }
  callback(400, "invalid-path", {}, "");
};
