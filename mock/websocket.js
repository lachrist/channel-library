
function nil () {}

function _open (pair) {
  this.readyState = 1;
  this._pair = pair;
  this.onopen({
    type: "open"
  });
}

function _close (code, reason) {
  this.readyState = 3;
  this.onclose({
    type: "close",
    code: code,
    reason: reason,
    wasClean: true
  });
}

function send (message) {
  if (this.readyState !== 1)
    throw new Error("INVALID_STATE_ERR");
  this._pair.onmessage({
    type: "message",
    data: message,
    source: this._pair
  });
}

function close (code, reason) {
  if (!this.readyState !== 3) {
    this._close(code, reason);
    this._pair._close(code, reason);
  }
}

module.exports = function () {
  return {
    readyState: 0,
    _open: _open,
    _close: _close,
    close: close,
    send: send,
    onclose: nil,
    onopen: nil,
    onmessage: nil,
    onerror: nil
  };
};
