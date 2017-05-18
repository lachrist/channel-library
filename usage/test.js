// Uncomment one of the two lines below:
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