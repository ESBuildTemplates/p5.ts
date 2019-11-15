

class Trap extends Polygon {
    
    draw(){

        fill(255, 0, 0)
        stroke(255, 98, 0)
        strokeWeight(random(1,5))
        rect(this.left, this.top, this.width, this.height, this.height / 3)
        stroke(255, 217, 0)
        strokeWeight(random(1,3))
        rect(this.left, this.top, this.width, this.height, this.height / 3)

        if(this._debug) this.debug()
    }

}