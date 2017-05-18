var Client = require("client-uniform/node.js");
// Asynchronous HTTP request to www.example.com:80
Client("www.example.com", false).http("GET", "/foo", {}, null, function (error, response) {
  if (error)
    throw error;
  console.log(response);
});
// Synchronous HTTPS request to www.example.com:443
console.log(Client("www.example.com", true).http("GET", "/foo", {}, null));