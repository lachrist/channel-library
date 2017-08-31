
module.exports = function (receptor, path, con) {
  var segments = path.split("/");
  segments.shift();
  while (receptor) {
    if (receptor.__onconnect__)
      return receptor.__onconnect__("/"+segments.join("/"), con);
    receptor = receptor.__childs__[segments.shift()];
  }
  con.close(4000, "invalid-path");
};
