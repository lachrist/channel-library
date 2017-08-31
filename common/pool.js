
var Events = require("events");

module.exports = function (post) {

  var pool = [];

  function send (message) {
    if (this !== pool[this._index_])
      throw new Error("Connection closed");
    post({
      name: "message",
      index: this._index_,
      message: message
    });
  }

  function close (code, reason) {
    if (this !== pool[this._index_])
      throw new Error("Connection already closed");
    pool[this._index_] = null;
    post({
      name: "close",
      index: this._index_,
      code: code,
      reason: reason
    });
  }

  return {
    free: function () {
      index = pool.indexOf(null);
      return index === -1 ? pool.length : index;
    },
    add: function (index) {
      var con = new Events();
      pool[index] = con;
      con.send = send;
      con.close = close;
      Object.defineProperty(con, "_index_", {value:index});
      return con;
    },
    terminate: function () {
      pool.forEach(function (con) {
        con.emit("close", 1001, "CLOSE_GOING_AWAY");
      });
      pool = null;
    },
    onclose: function (data) {
      pool[data.index].emit("close", data.code, data.reason);
      pool[data.index] = null;
    },
    onmessage: function (data) {
      pool[data.index].emit("message", data.message);
    },
    onopen: function (data) {
      pool[data.index].emit("open");
    }
  };

};
