const fs = require("fs");
var coman = function(args, write) {
    fs.readFile(args[0], "utf-8", (err, data) => {
      if (err) throw err
      write(data)
    })
  }

module.exports = coman;