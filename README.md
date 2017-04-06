# request-uniform
A uniform API for http[s] request.

## Node

```js
var RequestUniform = require("request-uniform/node");
// A path to a unix socket can also be passed (faster)
var request = RequestUniform("http://www.example.com/foo");
var method = "GET";
var path = "/bar";
var headers = {};
var body = "";
// Asynchronous http request with require("http").request
request(method, path, headers, body, function (error, status, headers, body) { ... });
// Synchronous http request by spawing curl with require("child_process").spawnSync
var [error, status, headers, body] = request(method, path, headers, body);
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