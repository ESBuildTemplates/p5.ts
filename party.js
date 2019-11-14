
class Party {

    constructor( options = {} ){
        this.border = new Border( this, options.padding )
        this.player = new Player( this )
        this.cursor = new Cursor( this, {
            stroke : [0],
            fill : [255],
            size : 15
        })
        this.levelIndex = 0
        this.levels = [
            new Level( this, {
                name : 'Crashtest',
                polygons : [ 
                    new Platform( -100, 200, 200, 10 ),
                    new Platform( -500, 0, 200, 10 ),
                    new Platform( 110, 200, 200, 10 ),
                    new Platform( -200, 100, 200, 10 ),
                    ...Polygon.staircase( new Platform( 100, -50, 20, 10), 10, true )
                ],
                enemy : [
                    new Enemy(),
                    new Enemy()
                ],
                scroll : [
                    'left',
                    'right'
                ]
            })
        ]
        this.keys = {}
    }

    get elements(){
        return [
            this.level,
            this.border,
            this.player,
            this.cursor
        ].sort(( a, b ) => a.z - b.z )
    }

    get level(){
        return this.levels[this.levelIndex]
    }

    frame(){
        this.elements.forEach( element => {
            element.frame()
        })
    }

    draw(){
        this.elements.forEach( element => {
            element.draw()
        })
    }

    debug(){
        textSize(20)
        fill(255,0,255)
        noStroke()
        text(`${this.level.name}\n${Math.round(frameRate())} FPS`, width / 2, 50)
        this.elements.forEach( element => {
            element.debug(...this.elements.filter(e => e !== element))
        })
    }
}