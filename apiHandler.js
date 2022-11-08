import http from 'http'
import {errorHandler} from './error.js'

const SUCURSALES_PORT = 2000
const RESERVAS_PORT = 2001


const RESERVAS_HANDLER = {
    GET: get,
    // POST: post,
    // DELETE: del
}

// const SUCURSALES_HANDLER = {
//     GET: getSucursales,
// }

export const apiHandler = async(req, res) =>{

    const url = req.url.split('/')[2]
    const {method} = req

    if (url == "reservas"){
        console.log("Entramos en reservas")
        RESERVAS_HANDLER[method](req,res)
    }
    else if (url == "sucursales"){
        console.log("Entramos en sucursales")
        SUCURSALES_HANDLER[method](req,res)
    }
    else errorHandler(400,"Endpoint no valido",res)
}

function get (req,res){

    
    const startsApi = req.url.indexOf('/api')
    const path = req.url.substring(startsApi, req.url.length)
    
    const options = {
        host:'localhost',
        port: RESERVAS_PORT,
        path: path,       
        method: 'GET',
        headers:{
            'Content-type': 'application/json'
        }
    }
    console.log("Options: ", options)

    const reqReservas = http.request(options,(resReservas)=>{
        let data = []
    
        resReservas.on('data',(chunk)=>{
            data.push(chunk)
        })

        resReservas.on('end',()=>{
            let body = JSON.parse(Buffer.concat(data).toString())
            console.log("Hicimos el get: obtuvimos este body:" , body )
            res.writeHead(200,{'Content-Type': 'application/json'})
            res.end(JSON.stringify(body))
        })
    })
   
    reqReservas.write(JSON.stringify({})) 
    reqReservas.end()

    

}
