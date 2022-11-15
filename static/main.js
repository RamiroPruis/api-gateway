const form = document.getElementById("reservas-form")
const reservaButton = document.getElementById("reserva-button")
const modal = document.getElementById("myModal")
const span = document.getElementsByClassName("close")[0]
const reservaConfirm = document.getElementById("reserva-confirm")
const diaContainer = document.getElementById("reserva-dia")
document.getElementById('reserva-dia').valueAsDate = new Date();

const SUCURSALES_PORT = 2000
const RESERVAS_PORT = 2001 //2

const getSucursales = async () => {
  const reqSucursales = await fetch("http://localhost:8000/api/sucursales/")
  return reqSucursales.json()
}

getSucursales().then((res) => {
  res.forEach((sucursal) => {
    document.querySelector(
      "#reserva-sucursal"
    ).innerHTML += `<option value=${sucursal.id}> ${sucursal.name}</option>`
  })
})

const getReservas = async (params) => {
  console.log("http://localhost:8000/api/reservas?" + params)
  const req = await fetch("http://localhost:8000/api/reservas?" + params)
  return req.json()
}

diaContainer.addEventListener("change", () => {
  let sucursal = document.querySelector("#reserva-sucursal").value
  let dia = document.querySelector("#reserva-dia").value
  
  getReservas(new URLSearchParams({ branchId: sucursal, userId: -1,dateTime:dia })).then(
    (res) => {
      console.log(res)
      document.querySelector("#reserva-horario").innerHTML = ""
      res.forEach(
        (reserva) =>
          (document.querySelector(
            "#reserva-horario"
          ).innerHTML += `<option value=${reserva.id}> ${new Date(
            reserva.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</option>`)
      )
    }
  )
})

form.addEventListener("submit", (ev) => {
  ev.preventDefault()
})

reservaButton.onclick = async () => {
  modal.style.display = "block"

  const obj = {}
  const formData = new FormData(form)
  for (const key of formData.keys()) {
    obj[key] = formData.get(key)
  }
  const fecha = new Date(obj.dia)
  console.log(obj)
  fetch(`http://localhost:8000/api/reservas/solicitar/${obj.sucursal}`,{
      method: 'POST',
      body:JSON.stringify(
       {
        userId:10,
        email:obj.email
      })
      }
     ).then(res => {
        console.log(res)
        if (res.status == 200){
        
          console.log("TURNO DISPONIBLE")
          solicitarReservaBox()
        }
        else{
          //aca va si no se puede reservar
        }
     })
}


const solicitarReservaBox = () => {
  const obj = {}
  const formData = new FormData(form)
  for (const key of formData.keys()) {
    obj[key] = formData.get(key)
  }

  let sucursalBox = document.querySelector("#reserva-sucursal")
  let sucursalName = sucursalBox.options[sucursalBox.selectedIndex].text
  obj["sucursal"] = sucursalName

  let horarioBox = document.querySelector("#reserva-horario")
  let horarioName = horarioBox.options[horarioBox.selectedIndex].text
  obj["horario"] = horarioName
  
  

  const modalContent = document.getElementById("modal-confirm-text")

  modalContent.innerHTML = `<p><b>Email: </b> ${obj.email}</p>
  <p><b>Sucursal: </b>${obj.sucursal} </p>
  <p><b>Dia: </b> ${obj.dia}</p>
  <p><b>Horario: </b>${obj.horario} </p>`
}



span.onclick = function () {
  modal.style.display = "none"
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none"
  }
}

reservaConfirm.onclick = () => {
  const obj = {}
  const formData = new FormData(form)
  for (const key of formData.keys()) {
    obj[key] = formData.get(key)
  }

  obj.userId = 0

  console.log(obj)

  modal.style.display = "none"
}
