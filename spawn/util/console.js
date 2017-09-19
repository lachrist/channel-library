
function log (writable) {
  var args = [];
  for (var i=0; i<arguments.length; i++)
    args.push(""+arguments[i]);
  this._writable.write(args.join(" ")+"\n");
}

module.exports = function (writable) {
  return {
    _writable: writable,
    log: log
  };
};
