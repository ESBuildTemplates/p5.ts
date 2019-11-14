

class Cursor extends HitBox {

    constructor( party, options = {} ){
        super( width / 2, height / 2, 10,
            new Polygon( 0, 0, 1, 1 )
        )
        this.fill = options.fill
        this.stroke = options.stroke || [255]
        this.size = options.size || 30
        this.party = party
    }

    frame(){
        this.x = mouseX
        this.y = mouseY
    }

    draw(){

        if(this.fill){
            fill(...this.fill)
        }else{
            noFill()
        }
        if(this.touch(...this.party.elements.filter(e => e !== this))){
            strokeWeight(3)
        }else{
            strokeWeight(1)
        }
        stroke(...this.stroke)

        rect(
            this.x, this.y, this.size, this.size,
            0, this.size / 2, this.size / 2, this.size / 2
        )
        
    }

    debug(){}
}