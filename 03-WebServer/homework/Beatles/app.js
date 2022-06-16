var http = require('http');
var fs   = require('fs');

var beatles=[{
  name: "John Lennon",
  birthdate: "09/10/1940",
  profilePic:"https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg"
},
{
  name: "Paul McCartney",
  birthdate: "18/06/1942",
  profilePic:"http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg"
},
{
  name: "George Harrison",
  birthdate: "25/02/1946",
  profilePic:"https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg"
},
{
  name: "Richard Starkey",
  birthdate: "07/08/1940",
  profilePic:"http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg"
}
]
// http.createServer( function(req, res){ 
// 	if( req.url === '/'){
// 		res.writeHead(200, { 'Content-Type':'text/html' })
// 		var html = fs.readFileSync(__dirname +'/index.html');
// 		res.end(html);
// 	}else if(req.url === '/api'){
// 		res.writeHead(200, { 'Content-Type':'application/json' })
// 		res.end( JSON.stringify(beatles) );
// 	}else if (req.url === '/api/John%20Lennon') {
//     res.writeHead(200, { 'Content-Type':'text/html' })
//     var html = fs.readFileSync(__dirname +'/beatle.html', 'utf8'); //Codificamos el buffer para que sea una String
//     var nombre = beatles[0].name; //Esta es la variable con la que vamos a reemplazar el template
//     html = html.replace('{nombre}', nombre);
//     console.log(nombre) // Usamos el método replace es del objeto String
//     res.end(html);
//   } else if(req.url === '/api/Paul%20McCartney'){
//     var html = fs.readFileSync(__dirname +'/beatle.html', 'utf8'); //Codificamos el buffer para que sea una String
//     var nombre = beatles[1].name; //Esta es la variable con la que vamos a reemplazar el template
//     html = html.replace('{nombre}', nombre); // Usamos el método replace es del objeto String
//     res.end(html);
//   } else{
// 		res.writeHead(404); //Ponemos el status del response a 404: Not Found
// 		res.end(); //No devolvemos nada más que el estado.
// 	}
function readFile(fileName) {
  return new Promise((resolve,reject) => {
    fs.readFile(fileName, 'utf-8', (error, data) => {
      if(error) reject(error)
      else resolve(data)
    })
  })
}


http.createServer((req,res)=> {
// /api
  if (req.url === '/api') {
    res.writeHead(200, {'Content-Type': 'application/json'})
    return res.end(JSON.stringify(beatles))
  }

// /
  if (req.url === '/') {
    return readFile('./index.html')
    .then((html) => {
      res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
      res.end(html)
    })
  }
  if (req.url[0] === '/' && req.url.length > 1) {
    // buscamos el beatle
    const search = req.url.split('/').pop();//eliminamos la barra y nos quedamos con lo que este escrito despues de api
    const beatle = beatles.find((beatle) => encodeURI(beatle.name) === search)//buscamos lo que esta en search dentro del objeto
    
    if(beatle) {
      return readFile('./beatle.html')
      .then((html) => {
        // remplazamos el template
        html = html.replace(/{name}/g, beatle.name)
        html = html.replace('{birthdate}', beatle.birthdate)
        html = html.replace('{profilePic}', beatle.profilePic)
        // contestamos la solicitud
        res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' })
        res.end(html)
      })
    }
  }

  // Respuesta 404
  res.writeHead(404, { 'Content-Type': 'text/html;charset=UTF-8' })
  res.end('<h1 style="text-align: center;">Página no encontrada</h1>')


}).listen(1337, '127.0.0.1');

