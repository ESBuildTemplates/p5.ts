
class Level extends HitBox {

    constructor( party, options ){
        super( width / 2, height / 2, 2, ...options.polygons)
        this.party = party
        this.name = options.name
        this.enemies = options.enemies
        this.scroll = options.scroll
    }

    debug( ...hitboxes ){

        strokeWeight(1)
        noFill()
        if(this.touch( ...hitboxes.filter( hitbox => {
            return !(hitbox instanceof Border)
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
                return !(hitbox instanceof Border)
            }))
        }
    }
}