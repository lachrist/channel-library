
var emitters = process.emitter.split(["random", "unmatched", "ping"]);

// Websocket connection //
var con = emitters.random.connect();
con.on("open", function () { console.log("connection establised") });
con.on("message", function (message) { console.log(message) });

// Synchronous XMLHttpRequest //
console.log(emitters.unmatched.request("GET", "/", {}, ""));

// Asynchronous XMLHttpRequest //
var counter = 0;
setInterval(function () {
  var id = ++counter;
  console.log("ping"+id);
  emitters.ping.request("GET", "/", {}, "", function (error, status, reason, headers, body) {
    if (status !== 200)
      throw new Error(status+" "+reason);
    console.log(body+id);
  });
}, 1000);
