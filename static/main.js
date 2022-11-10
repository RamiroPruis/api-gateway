const form = document.getElementById("reservas-form")
const reservaButton = document.getElementById("reserva-button")
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const reservaConfirm = document.getElementById("reserva-confirm")



form.addEventListener("submit",(ev)=>{
    ev.preventDefault()
    
})


reservaButton.onclick = ()=>{
    modal.style.display = "block"
}

span.onclick = function() {
    modal.style.display = "none"
  }
  
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
  }

reservaConfirm.onclick = ()=>{
    const obj = {}
    const formData = new FormData(form)
    for (const key of formData.keys()) {
        obj[key] = formData.get(key)
      }

      obj.userId = 0

      console.log(obj)

    modal.style.display = "none"
}