var Request = require("request-uniform/node.js");
Request("GET", "http://www.example.com", "/foo", {}, null, function (error, response) {
  if (error)
    throw error;
  console.log(response);
});
console.log(Request("GET", "https://www.example.com", "/foo", {}, null));