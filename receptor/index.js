
var Prototype = require("./prototype");

function onrequest (method, path, headers, body, callback) {
  callback(400, "no-handler", {}, this.__stack__);
}

function onconnect (path, con) {
  con.send(this.__stack__);
  con.close(4000, "no-handler");
}

module.exports = function (methods) {
  var self = Object.create(Prototype);
  if (typeof methods.onrequest !== "function" && typeof methods.onconnect !== "function")
    self.__stack__ = (new Error("No handler")).stack;
  self.__onrequest__ = typeof methods.onrequest === "function" ? methods.onrequest : onrequest;
  self.__onconnect__ = typeof methods.onconnect === "function" ? methods.onconnect : onconnect;
  return self;
};
