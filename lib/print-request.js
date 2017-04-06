
module.exports = function (method, path, headers, body) {
  var lines = [method+" "+path+" HTTP/1.1"];
  for (var h in headers)
    lines.push(h+": "+headers[h]);
  return lines.join("\r\n")+"\r\n\r\n"+body;
};
