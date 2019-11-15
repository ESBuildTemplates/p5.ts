
class CheckPoint extends Polygon {

    constructor( x, y ){

        super( x + 30, y - 60, 60, 60 )
        this.obtained = false

    }

    frame(){
        if(!this.obtained && this.touch(this.parent.party.player)){
            this.obtained = true
            this.parent.addSpawn(this)
        }
    }

    reset(){
        this.obtained = false
    }

    draw(){

        strokeWeight(5)
        stroke(0)
        if(!this.obtained){
            fill(100,100,255)
            rect(this.left + 10, this.top + 5, this.width - 10, this.height / 2)
        }else{

        }
        fill(100)
        rect(this.left, this.top, 10, this.height, 5, 5, 0, 0)

        if(this._debug) this.debug()
    }
}