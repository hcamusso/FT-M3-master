const fs = require("fs");
var coman = function(args, write) {
    fs.readFile(args[0], "utf-8", (err, data) => {
      if (err) throw err
      const lines = data.split("\n") // divide un string y genera un array
      write(lines.slice(0,(args[1] ? parseInt(args[1]) : 10)).join("\n"))
      // el slice toma de 0 a 10 ( o al numero pasado por arg)del arreglo generado y luego se hace join con el separador
    })
    
  }

module.exports = coman;