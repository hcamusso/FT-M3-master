const fs = require("fs");
var coman = function(args, write) {
    fs.readFile(args[0], "utf-8", (err, data) => {
      if (err) throw err
      const lines = data.split("\n") // divide un string y genera un array
      write(lines.slice((args[1] ? parseInt(args[1]) : 10) * -1).join("\n"))
      // el slice toma al reves que el head y luego se hace join con el separador
    })
    
  }

module.exports = coman;