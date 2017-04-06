
var RequestUniform = require("request-uniform/browser-prompt.js");
var request = RequestUniform("http://www.example.com/foo");
request("GET", "/bar", {}, "", console.log);
console.log(request("GET", "/bar", {}, ""));
