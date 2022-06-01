const commands = require('./commands/index.js');

// Output un prompt
process.stdout.write('prompt > ')
// El evento stdin 'data' se dispara cuando el user escribe una linea
process.stdin.on('data', function (data) {
    var [cmd, ...args] = data.toString().trim().split(" "); // remueve la nueva línea

    function write(data) {
      process.stdout.write(data);
      process.stdout.write('\nprompt > ');
    }

    if(commands.hasOwnProperty(cmd)) {
      commands[cmd](args, write)
    } else {
      write("Command not found")
    }
    
});