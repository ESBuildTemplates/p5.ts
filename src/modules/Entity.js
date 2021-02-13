
export class Entity {
    
    constructor( options = {} ){

        // Options
        this.options = options

        // Position
        this.name = options.name
        this.parent = options.parent
        this.children = options.children

        // Custom functions
        this.onDraw = options.onDraw
        this.onClic = options.onClic
        this.onDebug = options.onDebug
        this.onFrame = []

        // Flags
        this.isDebug = false
        this.isDraw = !!this.onDraw

        // Resets
        const reset = ()=>{
            this._x = this.options.x
            this._y = this.options.y
            this._scale = this.options.scale || 1
            this._width = this.options.width
            this._height = this.options.height
        }
        this.resets = [reset]
        reset()
    }

    // Getters
    get x(){
        if(this.parent)
        return this.parent.x + this._x
        return this._x
    }
    get y(){
        if(this.parent)
        return this.parent.y + this._y
        return this._y
    }
    get scale(){
        if(this.parent)
        return this.parent.scale * this._scale
        return this._scale
    }
    get width()     { return this._width * this.scale }
    get height()    { return this._height * this.scale }
    get left()      { return this.x - this.width / 2 }
    get right()     { return this.x + this.width / 2 }
    get top()       { return this.y - this.height / 2 }
    get bottom()    { return this.y + this.height / 2 }

    // Functions
    reset(){ 
        for(const reset of this.resets) reset() 
        if(this.children) for(const child of this.children) child.reset()
    }
    move( x, y ){
        this._x += x
        this._y += y
    }
    place( x, y ){
        this._x = x
        this._y = y
    }
    scale( scale ){
        this._scale = scale
    }
    draw(){
        if(this.isDraw && this.onDraw){
            this.onDraw()
            this.debug()
        }
    }
    debug(){
        if(this.isDebug && this.onDebug)
        this.onDebug()
    }

    // Tests
    isPressed(){
        return mouseIsPressed && this.isHovered()
    }
    isHovered(){
        return ( 
            mouseX > this.left && mouseX < this.right &&
            mouseY > this.top && mouseY < this.bottom
        )
    }
    isTouched( entity ){
        return (
            this.right > entity.left && this.left < entity.right &&
            this.bottom > entity.top && this.top < entity.bottom
        )
    }

}