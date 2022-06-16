var express = require('express');
var router = express.Router();

module.exports = router.post('/',(req,res)=>{
    console.log('Body:', req.body)
    const{name, lastname} = req.body
    res.send(`Usuario ${name} ${lastname} creado con exito(modularizado)`)
})