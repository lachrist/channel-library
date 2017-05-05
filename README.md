# request-uniform
A uniform API for http[s] request.

## Node

```js
// Choose either host or unix (faster)
var options = {
  secure: false,
  host: "localhost:8080",
  unix: "/absolute/path/to/unix/domain/socket", 
  method: "GET",
  path: "/path?query#hash"
  headers: {}, 
  body: null
};
// Asynchronous http(s) request
Protocols.http(options, function (error, response) {
  ...
});
// Asynchronous http(s) request without parsing the response
Protocols.http(options, true);
// Synchronous http(s) request
try {
  var response = Protocols.http(options);
} catch (error) {
  ...
}
```

Alternatively, the response can be manually entered by the user through a synchronous readline with `require("request-uniform/node-readline-sync")`.

## Browser

Through [browserify](http://browserify.org), this module provides the same interface for the browser:

```js
var RequestUniform = require("request-uniform/browser");
var request = RequestUniform("http://www.example.com/foo");
// Asynchronous http request with XMLHttpRequest's aync flag set to true
request("GET", "/bar", {}, "", function (error, status, headers, body) { ... });
// Synchronous http request with XMLHttpRequest's aync flag set to false
var [error, status, headers, body] = request("GET", "/bar", {}, "");
```

Alternatively, the response can be manually entered by the user through a synchronous prompt dialog with `require("browser/prompt")`.