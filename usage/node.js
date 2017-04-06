
var RequestUniform = require("request-uniform/node.js");
var request = RequestUniform("http://www.example.com/foo");
request("GET", "/bar", {}, "", console.log);
console.log(request("GET", "/bar", {}, ""));
