

class MoveBox extends HitBox {

    constructor(...args){

        super(...args)

        this.jumpProgress = false
        this.jumpMaxHeight = 150
        this.jumpHeight = 0
        this.speed = {
            x : 10,
            y : 15
        }
        this.velocity = {
            x : 0,
            y : 0
        }
    }

    initJump(){
        if(this.onGround()){
            this.velocity.y = -1
            this.jumpProgress = true
            this.jumpHeight = 0
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
        text(`MoveBox\nx:${Math.round(this.x)} - y:${Math.round(this.y)}\nw:${Math.round(this.width)} - h:${Math.round(this.height)}\nvx:${this.velocity.x}\nvy:${this.velocity.y}`, this.right + 30, this.top + 30)

        stroke(0,255,0,100)
        line(this.right,this.top,this.right + 30, this.top + 30)

        for(const polygon of this.polygons){
            polygon.debug( ...hitboxes )
        }
    }

    onGround(){
        let bottom = -Infinity
        let foots = []
        this.polygons.forEach( polygon => {
            if(bottom < polygon.bottom){
                bottom = polygon.bottom
                foots = [polygon]
            }else if(bottom == polygon.bottom){
                foots.push(polygon)
            }
        })
        return this.party.level.polygons.some( polygon => {
            return foots.some( jambe => {
                return (
                    jambe.bottom > polygon.top && jambe.top < polygon.top &&
                    jambe.right > polygon.left && jambe.left < polygon.right
                )
            })
        })
    }

    fall(){
        this.velocity.y += .1
    }
}