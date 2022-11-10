export  function errorHandler(code,msg,res){
    res.writeHead(code,{'Content-Type':'application/json'})
    const obj = {
        messageError: msg
    }
    res.end(JSON.stringify(obj))
}