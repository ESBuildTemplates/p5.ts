
var party;

function setup(){
    createCanvas(
        Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    )
    frameRate(50)
    party = new Party({
        padding : 10
    })
    
}

function draw(){

    background(20)
    party.frame()
    party.draw()
    //party.debug()

}

function keyPressed(){
    party.keys[String(keyCode)] = true
    if(keyCode == 32){
        party.player.initJump()
    }
}
function keyReleased(){
    party.keys[String(keyCode)] = false
}
