var express = require('express');

var app = express();
var morgan = require('morgan');

const postUser = require('./routes/postUser');

//middleware
app.use(morgan('dev')) //es un middleware que brinda info de las peticiones


app.use(express.json());//sabe leer el body


//metodos
app.get('/', (req,res)=>{
    console.log('Estoy en /')
    res.send('Estoy en /')
})
app.get('/html',(req,res)=>{
    console.log('Estoy en /html')
    res.send('<h1>Estoy en /html</h1>')
})
//envia un json
app.get('/obj', (req,res)=>{
    console.log('Estoy en /obj')
    const obj={nombre:'Hernan', apellido:'Camusso'}
    res.json(obj)
})
//enviar un status code
app.get('/status', (req,res)=>{
    console.log('Estoy en /status')
    res.sendStatus(404)
})
//manda un status 400 y un string al front
app.get('/msg/status',(req,res)=>{
    console.log('Estoy en /msg/status')
    res.status(400).send('Error 400')
})
// devuelve un objeto con el valor de la propiedad despues de :
//capturamos info que viene desde el front
app.get('/user/:name/:ape',(req,res)=>{
    console.log('Soy Params',req.params)
    res.json({user: req.params.name, ape:req.params.ape})
})
// url /query?nombre=fede devuelve req.query un objeto nombre: 'fede'
// capturamos info que envia el usuario desde el front
app.get('/query', (req,res)=>{
    console.log('Soy una query', req.query);
    res.send('algo')
})

app.get('/query1', (req,res)=>{
    console.log('Soy una query', req.query.nombre);
    res.send('algo')
})
// POST
// Request(body)---->middleware(traduce) ----->RUTA---->leer el body
// luego lo comente para modularizarlo
// app.post('/users',(req,res)=>{
//     console.log('Body:', req.body)
//     const{name, lastname} = req.body
//     res.send(`Usuario ${name} ${lastname} creado con exito`)
// })
app.use('/users', postUser)

app.listen(3000);