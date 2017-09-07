
var Pool = require("../common/pool.js");
var Onrequest = require("./private/onrequest.js");
var Onconnect = require("./private/onconnect.js");

module.exports = function (post) {
  var self = this;
  var pool = Pool(post);
  var views = null;
  var handlers = {
    message: pool.onmessage,
    close: pool.onclose,
    open: function (data) {
      post(data);
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
        post({
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
  return function (message) {
    if (views)
      return handlers[message.data.name](message.data);
    views = {};
    views.lock = new Uint8Array(message.data, 0, 1);
    views.length = new Uint32Array(message.data, 4, 1);
    views.data = new Uint16Array(message.data, 8);
  };
};
