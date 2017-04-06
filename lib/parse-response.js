
module.exports = function (response) {
  var headersbody = response.split("\r\n\r\n", 2);
  if (headersbody.length !== 2)
    return [new Error("The response does not contain \"\\r\\n\\r\\n\":\n"+response)];
  var lines = headersbody[0].split("\r\n");
  if (lines.length === 0)
    return [new Error("Cannot find the status line in:\n"+response)];
  var headers = {};
  for (var i=1, l=lines.length; i<l; i++) {
    var binding = lines[i].split(": ", 2);
    headers[binding[0]] = binding[1];
  }
  var parts = /^HTTP\/1\.1 ([0-9][0-9][0-9]) /.exec(lines[0]);
  if (!parts)
    return [new Error("Unknown status line: "+lines[0])]
  return [null, Number(parts[1]), headers, headersbody[1]];
};
