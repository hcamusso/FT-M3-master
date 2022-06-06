'use strict';

var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. loggea el poema dos stanza uno y stanza dos en cualquier orden
   *    pero loggea 'done' cuando ambos hayan terminado
   *    (ignora errores)
   *    nota: lecturas ocurriendo paralelamente (en simultaneo)
   *
   */

  // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );

  // promise version
  // ???
  // Promise.all([primerMetodo(), segundoMetodo(), tercerMetodo()])
  // .then(function(resultado){
  //  console.log(resultado); //un arreglo con los valores pasamos a resolve en cada metodo
  // });
  let p1 = promisifiedReadFile('poem-two/stanza-01.txt').then(resultado1 => blue(resultado1));
  let p2 = promisifiedReadFile('poem-two/stanza-02.txt').then(resultado2 => blue(resultado2));
  Promise.all([p1, p2])
  .then(()=> console.log('done'));
  
}




function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. loggea todas las stanzas en poema dos, en cualquier orden y loggea
   *    'done' cuando todas hayan terminado
   *    (ignora errores)
   *    nota: las lecturas ocurren en paralelo (en simultaneo)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  // async.each(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- B. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- B. callback version done --');
  //   }
  // );

  // promise version
  // ???
//hago un map con las promesas 
let arrPromesas = filenames.map((fn) => promisifiedReadFile(fn));
Promise.all(arrPromesas)
  .then( (respuesta) => {//en respuesta tengo un arreglo con los poemas
    console.log('-- B. promise version --');
    respuesta.forEach(poema => blue(poema));//cada elemento del arreglo es un poema que lo imprimo con la funcion blue
    console.log('-- A. callback version done --');
  })
// Version reducida:
// let arrPromesas = filenames.map(file => promisifiedReadFile(file).then(resultado => blue(resultado)));
// Promise.all(arrPromesas).then(()=>console.log('done'));

}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. Lee y loggea todas las stanzas en el poema dos, *en orden* y
   *    loggea 'done cuando hayan terminado todas
   *    (ignorá errores)
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- C. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- C. callback version done --');
  //   }
  // );

  // promise version
  // ???
  //filenames es el arreglo con los nombres de los archivos
  filenames.reduce((p, fn) => {//el valor inicial es una promesa, el reduce devolvera una promesa
    return p.then((stanza) => {
      if (stanza) blue(stanza);
      return promisifiedReadFile(fn);//aplica la promesa a cada elemento del arreglo
    });
  },    
    Promise.resolve(false)//valor inicial del reduce, devuelve una promesa con resolve false
  ).then((stanza) => {
    blue(stanza);
    console.log('-- A. callback version done --')
  });

  //ver version de martina con for en vez de reduce
}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. loggea todas las stanzas en el poema dos *en orden* asegurandote
   *    de fallar para cualquier error y logueando un 'done cuando todas
   *    hayan terminado
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- D. callback version --');
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(new Error(err));
  //     console.log('-- D. callback version done --');
  //   }
  // );

  // promise version
  // ???
//hago un map con las promesas 
var arrPromesas = filenames.map((fn) => promisifiedReadFile(fn));
Promise.all(arrPromesas)
  .then( (respuesta) => {//en respuesta tengo un arreglo con los poemas
    console.log('-- D. promise version --');
    respuesta.forEach(poema => blue(poema));//cada elemento del arreglo es un poema que lo imprimo con la funcion blue
    console.log('-- D. callback version done --');
  }).catch( (error) => {
    magenta(new Error(error));
    console.log('-- D. callback version done --');
  })
}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. Haz una versión promisificada de fs.writeFile
   *
   */

  var fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    // tu código aquí
    return new Promise((resuelto, cancelada) => {
      fs.writeFile(filename, str, 'utf8', function(err) {
        if(err) return cancelada(err);
        resuelto();
      });
    })
  }
}
