const request = require('request');
var coman = function(args, write) {
    request(args[0], function (error, response, body) {
        if(error) throw error
        write(body)
      });
    
  }

  module.exports = coman;