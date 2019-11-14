
class Border extends HitBox {

    constructor( party, padding = 0 ){
        super( 0, 0, 0,
            new Polygon( -width, -height, width * 3, height + padding ),
            new Polygon( width - padding, -height, width, height * 3),
            new Polygon( -width, height - padding, width * 3, height ),
            new Polygon( -width, -height, width + padding, height * 3 )
        )
        this.party = party
        this.padding = padding
    }

    get borderTop(){
        return this.polygons[0]
    }
    get borderRight(){
        return this.polygons[1]
    }
    get borderBottom(){
        return this.polygons[2]
    }
    get borderLeft(){
        return this.polygons[3]
    }

    frame(){

    }

    debug( ...hitboxes ){

        strokeWeight(1)
        noFill()
        if(this.touch( ...hitboxes.filter( hitbox => {
            return !(hitbox instanceof Level)
        }))){
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
            polygon.debug( ...hitboxes.filter( hitbox => {
                return !(hitbox instanceof Level)
            }))
        }
    }
}