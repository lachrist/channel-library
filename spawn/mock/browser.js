
var Common = require("./common.js");

module.exports = Common(function (path, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", path);
  req.onerror = callback;
  req.onload = function () {
    callback(req.status !== 200 && new Error("Cannot load "+path+": "+req.status+" "+req.statusText), req.responseText);
  };
  req.send();
});
