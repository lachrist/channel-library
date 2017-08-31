
var Factory = require("./factory");

function onrequest (method, path, headers, body, callback) {
  callback(400, "no-handler", {}, "");
}

function onconnect (path, con) {
  con.close(4000, "no-handler");
}

module.exports = function (methods) {
  return Factory({
    __onrequest__: methods.onrequest || onrequest,
    __onconnect__: methods.onconnect || onconnect
  });
};
