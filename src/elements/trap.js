

class Trap extends Polygon {

    constructor( ...args ){
        super( ...args )
    }
    
    draw(){

        fill(255, 0, 0)
        stroke(255, 98, 0)
        strokeWeight(random(1,this.height / 10))
        rect(this.left, this.top, this.width, this.height, this.height / 3)
        stroke(255, 217, 0)
        strokeWeight(random(1,this.height / 20))
        rect(this.left, this.top, this.width, this.height, this.height / 3)
        noStroke()
        for(var i=0; i<(this.height + this.width) / 100; i++){
            let size = random(5,15)
            fill(255, 100, 30)
            rect(
                random(this.left,this.right),
                random(this.top,this.bottom),
                size, size
            )
            size = random(5,15)
            fill(10)
            rect(
                random(this.left,this.right),
                random(this.top,this.bottom),
                size, size
            )
        }

        if(this._debug) this.debug()
    }

}