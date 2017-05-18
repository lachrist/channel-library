# Channel Uniform

API for performing http(s) request and creating websockets uniformely accross [node.js](http://nodejs.org) and browsers.
* Use `require("channel-uniform/node")` inside node applications.
* Use `require("channel-uniform/browser")` inside modules to be [browserified](http://browserify.org). 

```js
// Uncomment one of the two lines below
// var Channel = require("channel-uniform/node");
// var Channel = require("channel-uniform/browser");

// request
var channel1 = Channel("httpbin.org");
var response = channel1.request("GET", "/ip", {}, "");
console.log("\nhttp-sync\n", response);
channel1.request("GET", "/ip", {}, "", function (error, response) {
  if (error)
    throw error;
  console.log("\nhttp-async\n", response);
});

// websocket
var channel2 = Channel("echo.websocket.org")
var ws = channel2.websocket("/");
ws.onopen = function () {
  ws.onmessage = function (event) {
    console.log("\nws\n", event.data);
  };
  ws.send("Hello!");
};
```

```
http-sync
 { status: 200,
  reason: 'OK',
  headers: 
   { server: 'meinheld/0.6.1',
     date: 'Thu, 18 May 2017 13:30:07 GMT',
     'content-type': 'application/json',
     'access-control-allow-origin': '*',
     'access-control-allow-credentials': 'true',
     'x-powered-by': 'Flask',
     'x-processed-time': '0.000710010528564',
     'content-length': '32',
     via: '1.1 vegur' },
  body: '{\n  "origin": "81.164.22.111"\n}\n' }

http-async
 { status: 200,
  reason: 'OK',
  headers: 
   { connection: 'close',
     server: 'meinheld/0.6.1',
     date: 'Thu, 18 May 2017 13:30:08 GMT',
     'content-type': 'application/json',
     'access-control-allow-origin': '*',
     'access-control-allow-credentials': 'true',
     'x-powered-by': 'Flask',
     'x-processed-time': '0.000776052474976',
     'content-length': '32',
     via: '1.1 vegur' },
  body: '{\n  "origin": "81.164.22.111"\n}\n' }

ws
 Hello!
```

## `channel = Channel(host, secure)`

Instantiate a new channel.

* `host(string)`: defines the other end point of the channel, understand the formats detailed below.

   Format       | Example                | Remark
  --------------|------------------------|------------------------------------------------------------------------------------
  host and port | `"www.example.org:80"` | 
  host only     | `"www.example.org"`    | A default port is used: 80 for plain connections and 443 for encrypted connection
  port only     | `"8080"`               | Local port, equivalent to `"localhost:8080"`
  path          | "/path/to/unix-socket" | Absolute path to a unix-domain-socket, faster but works only on node

* `secure(boolean)`: indicates whether the communication should be encrypted or not.
* `channel(object)`: instance of this module.

## `response = channel.request(method, path, headers, body)`

Perform a synchronous http(s) request, may throw an error.

* `channel(object)`: instance of this module.
* `method(string)`: http method (eg: `"GET"` or `"POST"`).
* `path(string)`: path of the http(s) request
* `headers(object)`: mapping from header keys to header values
* `body(string)`: body of the http(s) request.
* `response(object)`: buffered response object
  * `response.status(number)`: http status code (eg: `200` or `404`).
  * `response.reason(string)`: reason stated in the status line
  * `response.headers(object)`: mapping from header keys to header values
  * `response.body(string)`: body of the response

## `channel.request(method, path, headers, body, callback)`

Perform an asynchronous http(s) request.

* `callback(function|any)`:
  * If callback is a function it will be called once the request is completed with two arguments:
    1. an instance of `Error` if it failed and `null` if it succeed
    2. a response object similar as with synchronous requests
  * Else if callback is a truthy value, the response will not be parsed (faster).
  * Else a synchronous request will actually be performed.

**Attention**: On node, when the callback parameter is a function, the request will only be fired only after resuming to the event loop.
It is the expected behavior of the [http.request](https://nodejs.org/api/http.html#http_http_request_options_callback).
Every other communication in this module will be fired immediately.

## `websocket = channel.websocket(path)`

* `path(string)`: path for the http(s) upgrade request.
* `websocket(object)`: instance of `window.WebSocket` in browsers and an instance of [ws](https://www.npmjs.com/package/ws) in node, both provide the same basic API:
  ```js
  var websocket = channel.websocket(path);
  websocket.onopen = function () { ... };
  websocket.onclose = function (code, reason) { ... };
  websocket.onerror = function (error) { ... };
  websocket.onmessage = function (event) {
    var message = event.data;
    ...
  };
  // once open //
  websocket.send(message);
  websocket.close(code, reason);
  ```
