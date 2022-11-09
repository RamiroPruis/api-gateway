import http from 'http'
import {errorHandler} from './error.js'

const SUCURSALES_PORT = 2000
const RESERVAS_PORT = 2001


const RESERVAS_HANDLER = {
    GET: getReservas,
    POST: postReservas
    // DELETE: del
}

const SUCURSALES_HANDLER = {
    GET: getSucursales,
}

export const apiHandler = async(req, res) =>{

    const url = req.url.split('/')[2]
    const {method} = req

    if (req.url.includes("reservas")){
        console.log("Entramos en reservas")
        RESERVAS_HANDLER[method](req,res)
    }
    else if (req.url.includes("sucursales")){
        console.log("Entramos en sucursales")
        SUCURSALES_HANDLER[method](req,res)
    }
    else errorHandler(400,"Endpoint no valido",res)
}

function getSucursales(req,res){

    const startsApi = req.url.indexOf('/api')
    const path = req.url.substring(startsApi, req.url.length)

    const options = {
        host:'localhost',
        port: SUCURSALES_PORT,
        path: path,       
        method: 'GET',
        headers:{
            'Content-type': 'application/json'
        }
    }

    const reqSucursales = http.request(options, (resSucursales)=>{
        let data = []

        resSucursales.on('data',(chunck) => data.push(chunck))

        resSucursales.on('end',()=>{
            let body = JSON.parse(Buffer.concat(data).toString())
            res.writeHead(200,{'Content-Type': 'application/json'})
            res.end(JSON.stringify(body))
        })
    })

       
    reqSucursales.write(JSON.stringify({})) 
    reqSucursales.end()
    
}

function getReservas(req,res){

    
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
    

    const reqReservas = http.request(options,(resReservas)=>{
        let data = []
    
        resReservas.on('data',(chunk)=>{
            data.push(chunk)
        })

        resReservas.on('end',()=>{
            let body = JSON.parse(Buffer.concat(data).toString())
            res.writeHead(200,{'Content-Type': 'application/json'})
            res.end(JSON.stringify(body))
        })
    })
   
    reqReservas.write(JSON.stringify({})) 
    reqReservas.end()

}


function postReservas (req,res){

    let body = []

    req.on('data', (chunck)=>body.push(chunck))

    req.on('end',()=>{

        body = JSON.parse(Buffer.concat(body).toString())
        const startsApi = req.url.indexOf('/api')
        const path = req.url.substring(startsApi, req.url.length)

        const options = {
            host:'localhost',
            port: RESERVAS_PORT,
            path: path,       
            method: 'POST',
            headers:{
                'Content-type': 'application/json'
            }
        }

        const reservaReq = http.request(options, (resReserva)=>{

            let reservaBody = []
            
            resReserva.on('data', (chunck)=>reservaBody.push(chunck))

            resReserva.on('end',()=>{
                reservaBody = JSON.parse(Buffer.concat(reservaBody).toString())
                res.writeHead(200,{'Content-Type': 'application/json'})
                res.end(JSON.stringify(reservaBody))
            })
        })

        reservaReq.write(JSON.stringify(body)) 
        reservaReq.end()




    })
    
    



}
