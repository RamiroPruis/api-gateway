import http from 'http'

const PORT = 2000

const server = http.createServer((req,res)=>{

})

server.listen(PORT,()=>{
    console.log("Escuchando en el puerto",PORT)
})