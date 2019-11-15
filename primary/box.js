
class Box {

    constructor( x, y, z, ...polygons ){
        this.polygons = polygons
        for(const polygon of this.polygons){
            polygon.setParent(this)
        }
        this.z = z
        this.x = x
        this.y = y
        this._debug = false
    }

    reset(){}

    get left(){
        return Math.min(...this.polygons.map( polygon => polygon.left ))
    }
    get top(){
        return Math.min(...this.polygons.map( polygon => polygon.top ))
    }
    get right(){
        return Math.max(...this.polygons.map( polygon => polygon.right ))
    }
    get bottom(){
        return Math.max(...this.polygons.map( polygon => polygon.bottom ))
    }
    get width(){
        return this.right - this.left
    }
    get height(){
        return this.bottom - this.top
    }
    get centerX(){
        return this.left + (this.width / 2)
    }
    get centerY(){
        return this.top + (this.height / 2)
    }

    frame(){
        for(const polygon of this.polygons){
            polygon.frame()
        }
    }
    
    draw(){
        for(const polygon of this.polygons){
            polygon.draw()
        }
        if(this._debug) this.debug()
    }

    debug(){
        noFill()
        strokeWeight(1)
        stroke(0,0,255)
        rect(this.left, this.top, this.width, this.height)
        line(this.left, this.top, this.right, this.bottom)
        line(this.right, this.top, this.left, this.bottom)
        noStroke()
        fill(0,255,0)
        textAlign(RIGHT,BOTTOM)
        text(`${this.constructor.name}\nX:${Math.round(this.x)}px Y:${Math.round(this.y)}px\nWidth:${Math.round(this.width)}px Height:${Math.round(this.height)}px\nTop:${Math.round(this.top)}px Left:${Math.round(this.left)}`,Math.round(this.centerX), Math.round(this.top))
    }
}