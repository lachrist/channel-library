
var Spawn = require("antena/spawn/browser");
var CommonjsPlaygroundEditor = require("commonjs-playground/editor");
var Playgrounds = require("./playgrounds.js");
var StdioGui = require("stdio-gui");

function noop () {}

window.onload = function () {
  var editors = {};
  ["child", "parent"].forEach(function (name) {
    var div = document.createElement("div");
    div.style.width = "400px";
    div.style.height = "200px";
    document.body.appendChild(div);
    editors[name] = CommonjsPlaygroundEditor(div, Playgrounds[name]);
  });
  var div = document.createElement("div");
  var button = document.createElement("button");
  document.body.appendChild(div);
  document.body.appendChild(button);
  var stdiogui = StdioGui(div);
  var child = {kill:noop};
  button.onclick = function () {
    button.innerText = child ? "Spawn" : "Kill";
    editors.parent.setReadOnly(Boolean(child));
    editors.child.setReadOnly(Boolean(child));
    if (child) {
      child.kill();
      child = null;
    } else {
      child = Spawn({content:editors.child.getBundle()}, [], eval(editors.parent.getBundle()));
      stdiogui.stdin.pipe(child.stdin);
      child.stdout.pipe(stdiogui.stdout, {end:false});
      child.stderr.pipe(stdiogui.stderr, {end:false});
    }
  }
  button.onclick();
}
