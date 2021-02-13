

class Player extends MoveBox {

    constructor( party ){
        
        super( 
            party.level.spawns[0].x,
            party.level.spawns[0].y, 2,
            new Polygon( -30, -120, 60, 60, 4 ), // tête
            new Polygon( -30, -60, 15, 30, 1 ), // bras gauche
            new Polygon( 15, -60, 15, 30, 1 ), // bras droit
            new Polygon( -15, -60, 30, 30, 3 ), // torse
            new Polygon( -15, -30, 15, 30, 2 ), // jambe gauche
            new Polygon( 0, -30, 15, 30, 2 ) // jambe droite
        )

        this.lifes = 3
        this.party = party
    }

    reset(){
        this.lifes = 3
        this.party.respawn()
    }

    frame(){

        // crop velocity
        if(this.velocity.y > 1) this.velocity.y = 1
        if(this.velocity.y < -1) this.velocity.y = -1
        if(this.velocity.x > 1) this.velocity.x = 1
        if(this.velocity.x < -1) this.velocity.x = -1
        if(this.velocity.x > -.1 && this.velocity.x < .1){
            this.velocity.x = 0
        }

        // apply move X,Y
        this.x += this.speed.x * this.velocity.x
        this.y += this.speed.y * this.velocity.y

        // jump flow
        if(this.party.keys['32'] && this.jumpProgress && this.jumpHeight < this.jumpMaxHeight){
            this.velocity.y -= .1
        }else{
            this.jumpProgress = false
        }
        this.jumpHeight += (this.speed.y * this.velocity.y) * -1

        // fall flow
        if(this.onGround() && this.velocity.y >= 0){
            this.velocity.y = 0
            this.jumpHeight = 0
            while(this.onGround()){
                this.y --
            }
            this.y ++
        }else{
            this.fall()
        }

        // horizontal move flow
        if(!this.party.keys['37'] == !this.party.keys['39']){
            this.velocity.x *= .5
        }
        if(this.party.keys['37']){
            this.velocity.x -= .2
        }
        if(this.party.keys['39']){
            this.velocity.x += .2
        }

        // deadly fall
        if(this.touch(...this.party.level.polygons.filter(polygon => polygon instanceof Trap))){
            this.lifes --
            this.party.respawn()
            if(this.lifes < 0){
                this.party.reset()
            }
        }
    }

    draw(){
        const [
            tete,
            brasGauche,
            brasDroit,
            torse,
            jambeGauche,
            jambeDroite
        ] = this.polygons

        // tete
        let 
            centerX = tete.centerX + this.velocity.x * 8,
            top = tete.top,
            bottom = tete.bottom

        if(this.party.keys['38']){
            top -= 5
            bottom -= 5
        }
        if(this.party.keys['40']){
            top += 5
            bottom += 5
        }
        strokeWeight(5)
        stroke(0)
        fill(255)
        rect(tete.left, tete.top, tete.width, tete.height, tete.width/5)

        const lifes = this.lifes
        
        // yeux
        noFill()
        if(lifes == 0){
            line(
                centerX - 15, top + 15, 
                centerX - 5, top + 30
            )
            line(
                centerX - 5, top + 15, 
                centerX - 15, top + 30
            )
            line(
                centerX + 15, top + 15, 
                centerX + 5, top + 30
            )
            line(
                centerX + 5, top + 15, 
                centerX + 15, top + 30
            )
        }else{
            line(
                centerX - 10, top + 15, 
                centerX - 10, top + 30
            )
            line(
                centerX + 10, top + 15, 
                centerX + 10, top + 30
            )
        }

        // bouche
        if(lifes >= 3){
            bezier(
                centerX - 10, bottom - 15, 
                centerX - 5, bottom - 10, 
                centerX + 5, bottom - 10,
                centerX + 10, bottom - 15
            )
        }else if(lifes == 2){
            line(
                centerX - 8, bottom - 15,
                centerX + 8, bottom - 15
            )
        }else if(lifes == 1){
            bezier(
                centerX - 10, bottom - 10, 
                centerX - 5, bottom - 15, 
                centerX + 5, bottom - 15,
                centerX + 10, bottom - 10
            )
        }else{
            bezier(
                centerX - 10, bottom - 10, 
                centerX - 5, bottom - 20, 
                centerX + 5, bottom - 20,
                centerX + 10, bottom - 10
            )
            line(
                centerX - 10, bottom - 10,
                centerX + 10, bottom - 10
            )
        }

        // bras gauche
        fill(255)
        angleMode(RADIANS)
        push()
        translate(brasGauche.centerX, brasGauche.top + 5)
        rotate(Math.max(this.velocity.x / 3, 0))
        translate(-brasGauche.centerX,-(brasGauche.top + 5))
        rect(brasGauche.left, brasGauche.top, brasGauche.width, brasGauche.height, brasGauche.width / 2, 0, 0, brasGauche.width / 2)
        pop()

        // bras droit
        push()
        translate(brasDroit.centerX, brasDroit.top + 5)
        rotate(Math.min(this.velocity.x / 3, 0))
        translate(-brasDroit.centerX,-(brasDroit.top + 5))
        rect(brasDroit.left, brasDroit.top, brasDroit.width, brasDroit.height, 0, brasGauche.width / 2, brasGauche.width / 2, 0)
        pop()

        // torse
        rect(torse.left, torse.top, torse.width, torse.height, 0, 0, torse.width / 4, torse.width / 4)

        // jambe gauche
        push()
        translate(jambeGauche.centerX, jambeGauche.top + 5)
        rotate(Math.max(map(this.jumpHeight,0,this.jumpMaxHeight,0,.5) + (this.velocity.x / 10), 0))
        translate(-jambeGauche.centerX, -(jambeGauche.top + 5))
        rect(jambeGauche.left, jambeGauche.top, jambeGauche.width, jambeGauche.height, jambeGauche.width / 2, jambeGauche.width / 2, 0, 0)
        pop()

        // jambe droite
        push()
        translate(jambeDroite.centerX, jambeDroite.top + 5)
        rotate(Math.min(map(this.jumpHeight,0,this.jumpMaxHeight,0,-.5) + (this.velocity.x / 10), 0))
        translate(-jambeDroite.centerX, -(jambeDroite.top + 5))
        rect(jambeDroite.left, jambeDroite.top, jambeDroite.width, jambeDroite.height, jambeDroite.width / 2, jambeDroite.width / 2, 0, 0)
        pop()

        if(this._debug){
            this.debug()
        }
        this.polygons.forEach( polygon => {
            if(polygon._debug) polygon.debug()
        })
    }
}