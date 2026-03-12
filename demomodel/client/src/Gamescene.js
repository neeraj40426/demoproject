import socket from "./socket.js";

export default class GameScene extends Phaser.Scene{

constructor(){
super("GameScene");
this.players={};
}

create(){

socket.on("stateUpdate",(players)=>{

Object.keys(players).forEach((id)=>{

const p = players[id];
if(p.isHost) return;
if(!this.players[id]){

this.players[id]=this.add.rectangle(
p.x,
p.y,
40,
40,
0x00ff00
);

}
else{
this.players[id].x=p.x;
this.players[id].y=p.y;
}
});
});
}
}