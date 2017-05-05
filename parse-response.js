var ParseHeaders = require("./parse-headers.js");

module.exports = function (response) {
  var index = response.indexOf("\r\n\r\n");
  if (index === -1)
    throw new Error("Cannot extract the header from:\n"+response);
  var lines = response.substring(0, index).split("\r\n");
  if (lines.length === 0)
    throw new Error("Cannot extract the status line from:\n"+response);
  var parts = /^HTTP\/[0-9]\.[0-9] ([0-9][0-9][0-9]) (.*)$/.exec(lines[0]);
  lines.splice(0, 1);
  if (!parts)
    throw new Error("Invalid status line: "+lines[0]);
  return {
    status: Number(parts[1]),
    reason: parts[2],
    headers: ParseHeaders(lines),
    body: response.substring(index+4)
  };
};
