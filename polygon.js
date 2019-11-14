
class Polygon {

    constructor( relX, relY, width, height, relZ = 1 ){
        this.relZ = relZ
        this.relX = relX
        this.relY = relY
        this.width = width
        this.height = height
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

    touch( polygon ){
        return (
            this.left < polygon.right && this.right > polygon.left &&
            this.top < polygon.bottom && this.bottom > polygon.top
        )
    }

    debug( ...hitboxes ){

        noFill()
        strokeWeight(1)
        if(hitboxes.some( hitbox => {
            return hitbox.polygons.some( polygon => {
                return this.touch(polygon)
            })
        })){
            stroke(255,0,0)
        }else{
            stroke(0,0,255)
        }
        rect(this.left,this.top,this.width,this.height)
    }

    frame(){}
    draw(){}

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
}