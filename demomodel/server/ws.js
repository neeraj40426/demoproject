const http = require("http")
const wsrv = require("ws")

const serv = http.createServer()
const wssv = new wsrv.Server({ server: serv })

const roms = {}

function code() {
  const chr = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
  let out = ""
  for (let i = 0; i < 6; i++)
    out += chr[Math.floor(Math.random() * chr.length)]
  return out
}

wssv.on("connection", sock => {

  sock.on("message", msg => {
    const dat = JSON.parse(msg)

    if (dat.type === "create") {
      const rid = code()
      roms[rid] = { host: sock, ctrs: [] ,players:{}}
      sock.rmid = rid
      sock.send(JSON.stringify({ type: "room", room: rid }))
    }

   if (dat.type === "join") {
  const rom = roms[dat.room]
  console.log("JOIN REQ:", dat.room, Object.keys(roms))
  if (!rom) return

  if (sock.pid) return   
  const pid = Math.random().toString(36).slice(2, 7)

  sock.rmid = dat.room
  sock.pid = pid

  rom.ctrs.push(sock)

  rom.players[pid] = {
    id: pid,
    x: Math.random() * 500,
    y: Math.random() * 300,
    inp: { lft:0, rgt:0, upt:0, dwn:0 }
  }

  sock.send(JSON.stringify({
    type: "joined",
    id: pid
  }))

  rom.host.send(JSON.stringify({
    type: "player_join",
    player: rom.players[pid]
  }))}
  if (dat.type === "input") {
  const rom = roms[sock.rmid]
  if (!rom) return

  rom.host.send(JSON.stringify({
    type: "input",
    id: sock.pid,
    inp: dat.inp
  }))
}

  })
sock.on("close", () => {
  const r = roms[sock.rmid]
  if (!r) return

  if (r.host === sock) {
    delete roms[sock.rmid]
  } else {
    delete r.players[sock.pid]
    r.ctrs = r.ctrs.filter(c => c !== sock)

    r.host.send(JSON.stringify({
      type: "leave",
      pid: sock.pid
    }))
  }
})
})

serv.listen(8080)
