import socket from "./socket.js";
import GameScene from "./Gamescene.js";

let currentRoom = null;
window.createRoom = function () {
  socket.emit("createRoom");
};

window.joinRoom = function () {
  const roomId = document.getElementById("roomInput").value;
  socket.emit("joinRoom", roomId);
};

window.startMove = function(direction){

if(!currentRoom) return;

let input = {x:0,y:0};

if(direction==="up") input.y=-1;
if(direction==="down") input.y=1;
if(direction==="left") input.x=-1;
if(direction==="right") input.x=1;

socket.emit("startMove",{roomId:currentRoom,input});

}

window.stopMove = function(){

if(!currentRoom) return;

socket.emit("stopMove",{roomId:currentRoom});

}
socket.on("roomCreated", (roomId) => {
  currentRoom = roomId;
  document.getElementById("roomDisplay").innerText = "Room ID: " + roomId;
});

socket.on("roomJoined", (roomId) => {
  currentRoom = roomId;
  document.getElementById("roomDisplay").innerText = "Joined Room: " + roomId;
});
let role = null;

socket.on("role",(r)=>{
  role = r;

  if(role === "host"){
    document.getElementById("controlsPanel").style.display = "none";
  }

  if(role === "player"){
    document.getElementById("game").style.display = "none";
  }
});
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game",
  backgroundColor: "#222",
  scene: [GameScene]
};

new Phaser.Game(config);