
var Pool = require("../common/pool.js");
var Onrequest = require("./private/onrequest.js");
var Onconnect = require("./private/onconnect.js");

module.exports = function (self, url) {
  var worker = new Worker(url);
  var pool = Pool(worker.postMessage.bind(worker));
  worker.onmessage = function (message) {
    var views = {};
    views.lock = new Uint8Array(message.data, 0, 1);
    views.length = new Uint32Array(message.data, 4, 1);
    views.data = new Uint16Array(message.data, 8);
    var handlers = {
      message: pool.onmessage,
      close: pool.onclose,
      open: function (data) {
        worker.postMessage(data);
        Onconnect(self, data.path, pool.add(data.index));
      },
      sync: function (data) {
        Onrequest(self, data.method, data.path, data.headers, data.body, function (status, reason, headers, body) {
          var response = JSON.stringify({
            status: status,
            reason: reason,
            headers: headers,
            body: body
          });
          views.length[0] = response.length;
          for (var i=0, l=Math.min(response.length, views.data.length); i<l; i++)
            views.data[i] = response.charCodeAt(i);
          views.lock[0] = 0;
        });
      },
      async: function (data) {
        Onrequest(self, data.method, data.path, data.headers, data.body, function (status, reason, headers, body) {
          worker.postMessage({
            name: "async",
            index: data.index,
            status: status,
            reason: reason,
            headers: headers,
            body: body
          });
        });
      }
    };
    worker.onmessage = function (message) {
      handlers[message.data.name](message.data);
    };
  };
  var interface = {
    terminate: function () {
      worker.terminate();
      pool.terminate();
    }
  };
  worker.onerror = function (error) {
    if ("onerror" in interface)
      return interface.onerror(error);
    throw error;
  };
  return interface;
};
