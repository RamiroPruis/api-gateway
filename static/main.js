const form = document.getElementById("reservas-form")
const reservaButton = document.getElementById("reserva-button")
const modal = document.getElementById("myModal")
const span = document.getElementsByClassName("close")[0]
const reservaConfirm = document.getElementById("reserva-confirm")
const sucursalContainer = document.getElementById("reserva-sucursal")

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
  console.log("holis")
  const req = await fetch("http://localhost:8000/api/reservas?" + params)
  return req.json()
}

sucursalContainer.addEventListener("change", () => {
  let sucursal = document.querySelector("#reserva-sucursal").value

  console.log(
    "http://localhost:8000/api/reservas?" +
      new URLSearchParams({
        branchId: sucursal,
      })
  )

  getReservas(new URLSearchParams({ branchId: sucursal, userId: -1 })).then(
    (res) => {
      console.log(res)
      document.querySelector("#reserva-horario").innerHTML = ""
      res.forEach(
        (reserva) =>
          (document.querySelector(
            "#reserva-horario"
          ).innerHTML += `<option value=${reserva.id}> ${new Date(
            reserva.dateTime
          )}</option>`)
      )
    }
  )
})

form.addEventListener("submit", (ev) => {
  ev.preventDefault()
})

reservaButton.onclick = () => {
  modal.style.display = "block"
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
