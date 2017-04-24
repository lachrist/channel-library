var Request = require("request-uniform/browser.js");
Request("GET", "http://www.example.com/foo", {}, null, function (error, response) {
  console.log(response);
});
console.log(Request("GET", "http://www.example.com/foo", {}, null));