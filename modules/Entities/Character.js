
import Entity from '../Entity'

export class Character extends Entity {

    constructor( options ){

        super( options )

        // onFrame
        this.frames.push(()=>{
            
        })

        // onReset
        const reset = ()=>{
            this.lifes = this.options.lifes || 1
            this._vit_x = this.options.vit_x || 0
            this._vit_y = this.options.vit_y || 0
            this._vel_x = this.options.vel_x || 0
            this._vel_y = this.options.vel_y || 0
        }
        this.resets.push(reset)
        reset()
    }

    
    
}