var fs = require('fs');

var coman = function() { fs.readdir('.', function(err, files) {
    if (err) throw err;
    files.forEach(function(file) {
      process.stdout.write("\n" + file.toString());
    })
    process.stdout.write("\nprompt > ");
  });}

module.exports = coman;