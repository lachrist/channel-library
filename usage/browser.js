
var RequestUniform = require("request-uniform/browser.js");
var request = RequestUniform("http://www.example.com/foo");
request("GET", "/bar", {}, "", console.log);
console.log(request("GET", "/bar", {}, ""));
