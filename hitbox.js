
class HitBox {

    constructor( x, y, z, ...polygons ){
        this.polygons = polygons
        for(const polygon of this.polygons){
            polygon.setParent(this)
        }
        this.z = z
        this.x = x
        this.y = y
    }

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

    touch( ...hitboxes ){
        return hitboxes.some( hitbox => {
            return hitbox.polygons.some( polygon => {
                return this.polygons.some( thisPolygon => {
                    return polygon.touch(thisPolygon)
                })
            })
        })
    }

    touchPolygons( ...polygons ){
        return polygons.some( polygon => {
            return this.polygons.some( thisPolygon => {
                return polygon.touch(thisPolygon)
            })
        })
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
    }

    debug( ...hitboxes ){

        strokeWeight(1)
        noFill()
        if(this.touch( ...hitboxes )){
            stroke(255,0,0,100)
        }else{
            stroke(0,0,255,100)
        }
        rect(this.left-1,this.top-1,this.width+2,this.height+2)

        textSize(16)
        noStroke()
        fill(0,255,0,100)
        text(`HitBox\nx:${Math.round(this.x)} - y:${Math.round(this.y)}\nw:${Math.round(this.width)} - h:${Math.round(this.height)}`, this.right + 30, this.top + 30)

        stroke(0,255,0,100)
        line(this.right,this.top,this.right + 30, this.top + 30)

        for(const polygon of this.polygons){
            polygon.debug( ...hitboxes )
        }
    }
}