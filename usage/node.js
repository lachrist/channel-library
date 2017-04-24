var Request = require("request-uniform/node.js");
Request("GET", "http://www.example.com/foo", {}, null, function (error, response) {
  console.log(response);
});
console.log(Request("GET", "http://www.example.com/foo", {}, null));