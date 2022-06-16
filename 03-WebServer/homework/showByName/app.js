var fs  = require("fs")
var http  = require("http")

// Esta version usa promesas
// function readFile(fileName) {
//     return new Promise((resolve,reject) => {
//         fs.readFile('./images/' + fileName,(err,data) => {
//             if(err) reject({
//                 data: '<h1> No encontrada </h1>',
//                 contentType: 'text/html',
//                 status: 404
//             })
//             else resolve({
//                 data,
//                 contentType: 'image/jpg',
//                 status: 404
//             })
//         })
//     })
// }

// http.createServer((req,res)=>{
//     readFile(req.url.split('/',2).pop())
//     .then((img) => {
//         res.writeHead(img.status, {'Content-Type': img.contentType})
//         return res.end(img.data)
//     })
//     .catch((err) => {
//         res.writeHead(err.status, {'Content-Type': err.contentType})
//         return res.end(err.data)
//     })

// Esta version es mas simple

http.createServer((req,res)=>{
    fs.readFile(`./images${req.url}.jpg`,(err,data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.end('img not found')
        } else {
            res.writeHead(200, {'Content-Type': 'image/jpeg'})
            res.end(data)
        }
    })
}). listen(1337, '127.0.0.1')
    

   
// }).listen(1337, '127.0.0.1')