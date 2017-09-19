
module.exports = function (blob) {
  var uri = URL.createObjectURL(blob);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, false);
  xhr.send();
  URL.revokeObjectURL(uri);
  var ui8 = new Uint8Array(xhr.response.length);
  for (var i=0; i<xhr.response.length; i++)
    ui8[i] = xhr.response.charCodeAt(i);
  return ui8.buffer;
};
