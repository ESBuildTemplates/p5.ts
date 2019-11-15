

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

    set( x, y ){
        this.x = x
        this.y = y
    }

    setBottom( x, y ){
        this.x = x + this.width / 2
        this.y = y - this.height
    }

    add( x, y ){
        this.x += x
        this.y += y
    }

    initJump(){
        if(this.onGround()){
            this.velocity.y = -1
            this.jumpProgress = true
            this.jumpHeight = 0
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
        return this.party.level.polygons.filter( polygon => {
            return (
                polygon instanceof Platform ||
                polygon instanceof Wall
            )
        }).some( polygon => {
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