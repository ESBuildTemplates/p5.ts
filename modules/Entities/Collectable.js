
import Entity from '../Entity'

export class Collectable extends Entity {

    constructor( options ){
        super( options )
        this.onCollected = options.onCollected
        this.isCollected = false
    }

    collect(){
        this.isCollected = true
        this.isDraw = false
    }
}