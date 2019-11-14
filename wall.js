

class Wall extends Polygon {
    
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
        
        textSize(12)
        noStroke()
        fill(0,255,0,100)
        text(`Wall\nx:${Math.round(this.left)} - y:${Math.round(this.top)}\nw:${Math.round(this.width)} - h:${Math.round(this.height)}`, this.right + 30, this.top + 30)

        stroke(0,255,0,100)
        line(this.right,this.top,this.right + 30, this.top + 30)
    }
}