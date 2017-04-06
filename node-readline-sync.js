var UserSync = require("./lib/user-sync.js");
var ReadlineSync = require("readline-sync");
module.exports = UserSync(ReadlineSync.question.bind(ReadlineSync));