'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor) {
    if (typeof executor !== 'function') { 
        throw new TypeError('"executor" debe ser una "function"')
        
    };
    this._state = 'pending';
    this._value = undefined;
    this._handlerGroups =[];
    

    executor(this._internalResolve.bind(this), 
             this._internalReject.bind(this));
};

  // Como puedes ver, `$Promise.resolve` "normaliza" valores que puede
  // o puede que no sean promesas. Los valores se convierten en promesas
  // y las promesas se mantienen como promesas. ¿No estas seguro que algo
  // es una promesa? Usa `$Promise.resolve`.
$Promise.resolve = function(value) {
  if (value instanceof $Promise) {
    return value
  } else { 
    var promise = new $Promise(() => {});
    // promise._state = 'fulfilled';
    // promise._value = value
    promise._internalResolve(value);
    return promise;
  }
};
 // El `Promise.all` de ES6 acepta cualquier
  // [iterable](https://mzl.la/1SopN1G), pero esto va mas alla del
  // scope de Pledge. Nuestro `.all` solo necesita soportar arreglos.
$Promise.all = function(values){
  if (Array.isArray(values) ) {
    const promise = new $Promise((resolve, reject) => {
      const promiseArray = values.map((promise) => $Promise.resolve(promise));
      const results = Array(values.length);
      let pendingCount = values.length;
      promiseArray.forEach((promise, i) =>
        promise.then(
          (value) => {
            results[i] = value;
            pendingCount--;
            if (pendingCount === 0) {
              resolve(results);
            }
          },
          (error) => reject(error)
        )
      );
    });
  
    return promise;
  } else {
     // Pasar un no-arreglo a `$Promise.all` arroja un `TypeError`.
    throw new TypeError('Los valores no son un arreglo')
  }
};

$Promise.prototype._internalResolve= function (valor) {
  if (this._state === 'pending') {
    this._state = 'fulfilled';
    this._value = valor;
    this._callHandlers();
  }
};
$Promise.prototype._internalReject= function (razon) {
  if (this._state === 'pending') {
    this._state = 'rejected';
    this._value = razon;
    this._callHandlers();
  }
};
$Promise.prototype._callHandlers = function () {
  //mientras haya promesas en el arreglo
  while (this._handlerGroups.length) {
    const cb = this._handlerGroups.shift()
    //si el estado es fulfilled
    if (this._state === "fulfilled") {
      // si el then tiene succesCB manejador de completada
      if (cb.successCb) {
        try {
          //devuelve promiseB via el .then
          const result = cb.successCb(this._value)
          if (result instanceof $Promise) {
            return result.then(
              value => cb.downstreamPromise._internalResolve(value),
              error => cb.downstreamPromise._internalReject(error)
            )
          } else {
            cb.downstreamPromise._internalResolve(result)
          }
        } catch (err) {
          cb.downstreamPromise._internalReject(err)
        }
      } else {//si no tiene success handler la promise B es completada con el valor de la promise A
        return cb.downstreamPromise._internalResolve(this._value)
      }
    } else if (this._state === "rejected") {
      //si es rechazada, llama al errorhandler
      if (cb.errorCb) {
        try {
          //llama al error handler pasando el valor de la promesa
          const result = cb.errorCb(this._value)
          if (result instanceof $Promise) {
            return result.then(
              value => cb.downstreamPromise._internalResolve(value),
              error => cb.downstreamPromise._internalReject(error)
            )
          } else {
            cb.downstreamPromise._internalResolve(result)
          }
        } catch (err) {
          cb.downstreamPromise._internalReject(err)
        }
      } else {//Si pA es rechazado pero no tiene un error handler, pB es rechazado con la razón de pA
        return cb.downstreamPromise._internalReject(this._value)
      }
    }
  }
}
$Promise.prototype.then = function (successCb, errorCb) {
  if (typeof successCb !== 'function') successCb = false;
  if (typeof errorCb != 'function') errorCb = false;
  //para llamar a una promesa cuando la anterior es completada
  // agrega una nueva promesa al handler group
  const downstreamPromise = new $Promise(() => {});
  let obj = { successCb, errorCb, downstreamPromise };
  this._handlerGroups.push(obj);
  // llama al succeshandeler cuando el estado no es pendiente
  if (this._state !== 'pending') this._callHandlers()
 //devuelve la nueva promesa
  return downstreamPromise
}
// describe un metodo catch
$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb)
}




module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
