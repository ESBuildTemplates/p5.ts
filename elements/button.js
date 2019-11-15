

class Button extends HitBox {

    constructor( x, y, text, callback ){
        super( x, y, 9, new Polygon( -60, -15, 120, 30))
        this.callback = callback
        this.text = text
    }

}