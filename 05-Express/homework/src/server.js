// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());


// TODO: your code to handle requests
server.get('/', function(req, res){ //Ruta para un GET a /
  var obj = {
    saludo: 'Hola Mundo! ' 
  }
  res.json(obj);
  });
let id = 0



server.post('/posts', (req,res) => {

    const{author, title, contents} = req.body;
    if (! author) {
      res.status(STATUS_USER_ERROR).json({error:'falta el parametro "author"'})
      } else { if (! title) {
          res.status(STATUS_USER_ERROR).json({error:'falta el parametro "title"'})
        } else { if (! contents) {
          res.status(STATUS_USER_ERROR).json({error:'falta el parametro "contents"'})
          } else {
            let post = {author : author, title : title, contents : contents,id : id++};
            posts.push(post);
            res.json(post)
          }
        }
      }
    })  
server.post('/posts/author/:author', (req,res)=>{
  let {author} = req.params
  const{title, contents} = req.body;
  
  if (!(title && contents)) {
        res.status(STATUS_USER_ERROR).json({error:'faltan parametros'})
      } else {
          let post = {author : author, title : title, contents : contents,id : id++};
          console.log(post)
          posts.push(post);
          res.json(post)
        }
      }
    
)

server.get('/posts', (req, res) => {
  if(req.query.term) {
    const resultado = posts.filter((post) => post.title.includes(req.query.term) || post.contents.includes(req.query.term))
    return res.status(200).json(resultado)
}
return res.json(posts)
})

server.get('/posts/:author', (req,res)=>{
  const author = req.params.author
  const resultado = posts.filter((post) => post.author.includes(author))

  if (resultado.length === 0) res.status(STATUS_USER_ERROR).json({error:'error'})
  else res.status(200).json(resultado)
})
server.get('/posts/:author/:title', (req,res)=>{
  const author = req.params.author
  const title = req.params.title
  
  const resultado = posts.filter((post) => {
    if (post.author.includes(author) & post.title.includes(title)) {
      return post
    } 
  } )

  if (resultado.length === 0) res.status(STATUS_USER_ERROR).json({error:'No existe ningun post con dicho titulo y autor indicado'})
  else res.status(200).json(resultado)
})

server.put('/posts',(req,res)=>{
  const {id, author, title, contents} = req.body
  if (!id || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parametros necesarios"})
  } else {
  const post = posts.find((post) => post.id === id)
  if(!post) return res.status(STATUS_USER_ERROR).json({error: `El id ${id} no existe`})

  post.title = title;
  post.contents = contents;
  res.status(200).json(post);
  }
})

server.delete('/posts', (req,res)=>{
  const{id} = req.body;
  if(!id) return res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"});
  const post = posts.find((post) => post.id === id)
  if(post) {
    posts = posts.filter((post) => post.id !==id)
    res.status(200).json({ success: true })
  } else{
    res.status(STATUS_USER_ERROR).json({ error: "Informa que el id indicado no corresponde con un Post existente"})
  }
})

server.delete('/author', (req,res)=> {
  const{author} =req.body;
  if(!author) return res.status(STATUS_USER_ERROR).json({error: "No existe el autor indicado"});
  let deleted = posts.filter((post) => post.author === author)
  if(deleted.length !== 0) {
    posts = posts.filter((post) => post.author !==author)
    res.status(200).json(deleted)
  } else{
    res.status(STATUS_USER_ERROR).json({ error: "No existe el autor indicado"})
  }
})
module.exports = { posts, server };
