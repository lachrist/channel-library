
var Fs = require("fs");
var Path = require("path");
var Browserify = require("browserify");

Browserify(Path.join(__dirname, "child.js")).bundle(function (error, bundle) {
  if (error)
    throw error;
  var template = Fs.readFileSync(Path.join(__dirname, "index-template.js"), "utf8");
  Fs.writeFileSync(Path.join(__dirname, "index.js"), [
    "var TEMPLATE_CHILD_URL = URL.createObjectURL(new Blob([",
    "  "+JSON.stringify(bundle.toString("utf8")),
    "], {type: \"application/javascript\"}));",
    template
  ].join("\n"), {encoding:"utf8"});
});
