var fs = require('fs');

var coman = function(args, write) { 
  fs.readdir('.', function(err, files) {//en files queda un arreglo
    if (err) throw err;
    //files.forEach(function(file) { se puede hacer mejor con un join
      write(files.join('\n'));

  });}

module.exports = coman;