let ws = null
let myid = null

const inp = { lft:0, rgt:0, upt:0, dwn:0 }

const send = () => {
  if (!ws || !myid) return
  ws.send(JSON.stringify({
  type: "input",
  inp: inp
}))

}

document.getElementById("join").onclick = () => {
  if (ws) return
  const room = document.getElementById("roomin").value.trim()
  ws = new WebSocket("ws://localhost:8080")

  ws.onopen = () => ws.send(JSON.stringify({ type:"join", room }))
  ws.onmessage = e => {
    const m = JSON.parse(e.data)
    if (m.type === "joined") myid = m.id
     document.getElementById("pad").style.display = "block"
  }


}
setInterval(send, 100)
const btns = document.querySelectorAll("[data-d]")

btns.forEach(btn => {
  const key = btn.dataset.d

  btn.onpointerdown = e => {
    e.preventDefault()
    btn.setPointerCapture(e.pointerId)
    inp[key] = 1
    send()
  }

  btn.onpointerup = e => {
    btn.releasePointerCapture(e.pointerId)
    inp[key] = 0
    send()
  }

  btn.onpointercancel = () => {
    inp[key] = 0
    send()
  }
})

window.addEventListener("blur", () => {
  for (let k in inp) inp[k] = 0
  send()
})