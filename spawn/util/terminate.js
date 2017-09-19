
module.exports = function (code, signal) {
  child.emit("exit", code, signal);
  var counter = 0;
  function onclose () { --counter || child.emit("close", code, signal) }
  [child.stdio].forEach(function (stream) {
    counter++;
    stream.on("close", onclose);
    stream.destroy();
  });
}