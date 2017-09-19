
var Fs = require("fs");
var Common = require("./common.js");

module.exports = Common(function (path, callback) { Fs.readFile(path, "utf8", callback) });
