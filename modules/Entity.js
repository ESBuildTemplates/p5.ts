
export class Entity {
    
    constructor( options = {} ){

        // Position
        this.name = options.name
        this.parent = options.parent
        this.children = options.children

        // Properties
        this._x = options.x
        this._y = options.y
        this._width = options.width
        this._height = options.height
        this._scale = options.scale || 1

        // Custom functions
        this.onDraw = options.onDraw
        this.onClic = options.onClic
        this.onDebug = options.onDebug

        // Flags
        this.isDebug = false
        this.isDraw = !!this.onDraw

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
    move( x, y ){
        this._x += x
        this._y += y
    }
    place( x, y, real ){
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