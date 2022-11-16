const form = document.getElementById("reservas-form")
const reservaButton = document.getElementById("reserva-button")
const modal = document.getElementById("myModalConfirm")
const modalError = document.getElementById("myModalError")
const modalSolicitar = document.getElementById("myModalSolicitar")
const span = document.getElementsByClassName("close")[0]
const reservaConfirm = document.getElementById("reserva-confirm")
const diaContainer = document.getElementById("reserva-dia")
document.getElementById('reserva-dia').valueAsDate = new Date();

const MARKERS_URL = "https://cartes.io/api/maps/b15857ea-d028-4563-84e7-294188a0ad7b/markers"
const MAPS_URL = "https://cartes.io/api/maps"


const getSucursales = async () => {
  const reqSucursales = await fetch("http://localhost:8000/api/sucursales/")
  return reqSucursales.json()
}

const createMarkers = async (res) => {

  // const options = {
  //   method: "POST",
  //   cors: "no-cors",
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     title: "EL PAKE MAPS",
  //     slug: "el pake",
  //     description: "EL PAKEEEE",
  //     privacy: "public",
  //     users_can_create_markers: "yes"
  //   })  
  // }

  // await fetch(MAPS, options)

  await res.forEach(async(sucursal) => {
    const options = {
      method: "POST",
      cors: "no-cors",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lat: sucursal.lat,
        lng: sucursal.lng,
        category_name :sucursal.name
      })
    }
    console.log("Creando marker, url:" + MARKERS_URL + options.body)
    const req = await fetch(MARKERS_URL, options)
    console.log(req)
  })

}

getSucursales().then((res) => {
  res.forEach((sucursal) => {
    document.querySelector(
      "#reserva-sucursal"
    ).innerHTML += `<option value=${sucursal.id}> ${sucursal.name}</option>`
  })
  createMarkers(res)
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
  const obj = {}
  const formData = new FormData(form)
  for (const key of formData.keys()) {
    obj[key] = formData.get(key)
  }
  const idreserva = document.querySelector("#reserva-horario").value

  console.log(idreserva)

  fetch(`http://localhost:8000/api/reservas/solicitar/${idreserva}`,{
      method: 'POST',
      body:JSON.stringify(
       {
        userId:10,
        email:obj.email
      })
      }
     ).then(res => {
        console.log(res)
        confirmarReservaBox(res.status)
     })
}



const confirmarReservaBox = (statusCode) => {

  if (statusCode == 200){
    modal.style.display = "block"

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
    
    
    console.log(obj)

    const modalContent = document.getElementById("modal-confirm-text")

    modalContent.innerHTML = `<p><b>Email: </b> ${obj.email}</p>
    <p><b>Sucursal: </b>${obj.sucursal} </p>
    <p><b>Dia: </b> ${obj.dia}</p>
    <p><b>Horario: </b>${obj.horario} </p>`
  }
  else{
    myModalError()
  }
}

const solicitarReservaBox = (statusCode) => {
  if (statusCode == 200){
    modalSolicitar.style.display = "block"
  }
  else{
    myModalError()
  }
}

const myModalError = () => {
  modalError.style.display = "block"
  const modalContent = document.getElementById("modal-confirm-error")
  modalContent.innerHTML = "<p>El error es: ElPAKE</p>"
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

  const idreserva = document.querySelector("#reserva-horario").value

  fetch(`http://localhost:8000/api/reservas/confirmar/${idreserva}`,{
     method:'POST',
     body: JSON.stringify({
        userId: 10,
        email: obj.email
     })
     }).then(res => {
      console.log("Reserva confirmada")
      solicitarReservaBox(res.status)
  })

  modal.style.display = "none"
}

