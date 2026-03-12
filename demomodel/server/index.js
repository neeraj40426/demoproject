const http = require("http");
const {Server} = require("socket.io");

const server = http.createServer();

const io = new Server(server,{
cors:{origin:"*"}
});

const rooms={};

io.on("connection",(socket)=>{


socket.on("createRoom", () => {

  const roomId = Math.random().toString(36).substring(2,7);

  rooms[roomId] = {};

  socket.join(roomId);

  rooms[roomId][socket.id] = {
    isHost: true
  };
  socket.emit("role","host");
  socket.emit("roomCreated", roomId);

});

socket.on("joinRoom",(roomId)=>{

if(!rooms[roomId]) return;

socket.join(roomId);

rooms[roomId][socket.id]={
x:Math.random()*700,
y:Math.random()*500,
vx:0,
vy:0,
isHost: false
};
socket.emit("role","player");
socket.emit("roomJoined",roomId);

});
socket.on("startMove",({roomId,input})=>{

const player = rooms[roomId]?.[socket.id];
if(!player) return;

player.vx = input.x;
player.vy = input.y;

});

socket.on("stopMove",({roomId})=>{

const player = rooms[roomId]?.[socket.id];
if(!player) return;

player.vx = 0;
player.vy = 0;

});
socket.on("disconnect",()=>{

for(const roomId in rooms){
delete rooms[roomId][socket.id];
}

});

});

setInterval(()=>{
for(const roomId in rooms){
for(const id in rooms[roomId]){
const p = rooms[roomId][id];
const speed = 5;
p.x += p.vx * speed;
p.y += p.vy * speed;
}
io.to(roomId).emit("stateUpdate",rooms[roomId]);
}
},50);

server.listen(3000,()=>{
console.log("Server running on port 3000");
});