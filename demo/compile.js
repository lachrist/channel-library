
//  mkdir node_modules
// npm install browserify
// cd node_modules/
// ln -s ../../../commonjs-playground/ commonjs-playground
// ln -s ../../../stdio-gui/ stdio-gui
// ln -s ../../ antena

var Fs = require("fs");
var Path = require("path");
var Browserify = require("browserify");
var CommonjsPlayground = require("commonjs-playground");

CommonjsPlayground(Path.join(__dirname, "parent.js"), function (error, pplayground) {
  if (error)
    throw error;
  CommonjsPlayground(Path.join(__dirname, "child.js"), function (error, cplayground) {
    if (error)
      throw error;
    Fs.writeFile(Path.join(__dirname, "playgrounds.js"), "module.exports = "+JSON.stringify({
      parent: pplayground,
      child: cplayground
    }, null, 2)+";\n", {encoding:"utf8"}, function (error) {
      Browserify(Path.join(__dirname, "script.js")).bundle(function (error, bundle) {
        if (error)
          throw error;
        var script = bundle.toString("utf8");
        Fs.readFile(Path.join(__dirname, "style.css"), "utf8", function (error, style) {
          if (error)
            throw error;
          Fs.writeFile(Path.join(__dirname, "index.html"), [
            "<!DOCTYPE html>",
            "<html>",
            "  <head>",
            "    <title>Antena's Demo</title>",
            "    <style>"+style+"</style>",
            "    <script>"+script.replace("</script>", "<\\/script>")+"</script>",
            "  </head>",
            "  <body></body>",
            "</html>"
          ].join("\n"), {encoding:"utf8"}, function (error) {
            if (error)
              throw error;
            console.log("Done");
          });
        });
      });
    });
  })
});
