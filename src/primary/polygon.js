
class Polygon {

    constructor( relX, relY, width, height, relZ = 1 ){
        this.relZ = relZ
        this.relX = relX
        this.relY = relY
        this.width = width
        this.height = height
        this._debug = false
    }

    setParent(parent){
        this.parent = parent
    }

    get left(){
        return this.parent.x + this.relX
    }
    get top(){
        return this.parent.y + this.relY
    }
    get right(){
        return this.left + this.width
    }
    get bottom(){
        return this.top + this.height
    }
    get centerX(){
        return this.left + (this.width / 2)
    }
    get centerY(){
        return this.top + (this.height / 2)
    }

    touch( ...resolvables ){
        return resolvables.find( resolvable => {
            if(resolvable instanceof Polygon){
                return Polygon.touch(resolvable,this)
            }else if(resolvable instanceof Box){
                return resolvable.touch(this)
            }
        })
    }

    reset(){}
    frame(){}
    draw(){
        fill(255)
        stroke(0)
        strokeWeight(5)
        rect(this.left, this.top, this.width, this.height, this.height / 3)
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
        text(`${this.constructor.name}\nrelX:${Math.round(this.relX)}px relY:${Math.round(this.relY)}px\nWidth:${Math.round(this.width)}px Height:${Math.round(this.height)}px\nTop:${Math.round(this.top)}px Left:${Math.round(this.left)}`,this.centerX, this.top)
    }

    static staircase( polygon, nbr, desc ){
        const staircase = []
        const Class = polygon.constructor
        for(var i=0; i<nbr; i++){
            staircase.push(new Class(
                polygon.relX + polygon.width * i,
                polygon.relY + (desc ? (polygon.height * i) : -(polygon.height * i)),
                polygon.width,
                polygon.height,
                polygon.relZ
            ))
        }
        return staircase
    }

    static touch(p1, p2){
        return (
            p1.left < p2.right && p1.right > p2.left &&
            p1.top < p2.bottom && p1.bottom > p2.top
        )
    }
}