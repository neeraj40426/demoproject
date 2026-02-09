const cvs = document.getElementById("cvs")
const ctx = cvs.getContext("2d")

let room = ""
let cnt = 0

const spd = 200
let last = 0

const plys = {}

const ws = new WebSocket("ws://localhost:8080")

ws.onopen = () => {
  ws.send(JSON.stringify({ type: "create" }))
}

ws.onmessage = e => {
  const d = JSON.parse(e.data)

  if (d.type === "room") {
    room = d.room
    document.getElementById("room").textContent = room
  }

if (d.type === "player_join") {
  plys[d.player.id] = d.player
  document.getElementById("cnt").textContent = ++cnt
}
if (d.type === "input") {
  const p = plys[d.id]
  if (!p) return
  p.inp = d.inp
  console.log(p.inp.lft)
}


  if (d.type === "leave") {
  delete plys[d.pid]
  document.getElementById("cnt").textContent = --cnt
}
}


function upd(dt) {
  for (const k in plys) {
    const p = plys[k]
    if (p.inp.lft) p.x -= spd * dt
    if (p.inp.rgt) p.x += spd * dt
    if (p.inp.upt) p.y -= spd * dt
    if (p.inp.dwn) p.y += spd * dt
  }
}

function drw() {
  ctx.clearRect(0,0,cvs.width,cvs.height)
  for (const k in plys) {
    const p = plys[k]
    ctx.fillRect(p.x, p.y, 30, 30)
  }
}

function loop(t) {
  const dt = (t - last) / 1000
  last = t
  upd(dt)
  drw()
  requestAnimationFrame(loop)
  
}


requestAnimationFrame(loop)
