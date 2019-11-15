
class Party {

    constructor(){
        this.levels = [
            new Level( this, {
                spawn : {
                    x : width / 2 + 100,
                    y : height / 2
                },
                name : 'Crashtest',
                polygons : [
                    new Platform( width / 2, height / 2, 200, 10 ),
                    new Platform( width / 2 + 400, height / 2, 200, 10 ),
                    new Trap( width / 2 + 200, height / 2, 200, 10 ),
                    new CheckPoint( width / 2 + 400, height / 2, 200, 10 )
                ],
                enemy : [
                    new Enemy(),
                    new Enemy()
                ]
            })
        ]
        this.levelIndex = 0
        this.keys = {}
        this._debug = false
        this.player = new Player( this )
        this.cursor = new Cursor( this )
    }

    get elements(){
        return [
            this.level,
            this.player,
            this.cursor
        ].sort(( a, b ) => a.z - b.z )
    }

    get level(){
        return this.levels[this.levelIndex]
    }

    respawn(){
        this.level.x = 0
        this.level.y = 0
        this.player.set(
            this.level.spawns[0].x,
            this.level.spawns[0].y
        )
        this.player.velocity = {
            x : 0,
            y : 0
        }
    }

    reset(){
        this.elements.forEach( element => {
            element.reset()
        })
    }

    frame(){
        const 
            distX = this.player.x - width / 2,
            distY = this.player.y - height / 2;
        this.elements.forEach( element => {
            element.x -= distX / 10
            element.y -= distY / 10
            element.frame()
        })
    }

    draw(){
        this.elements.forEach( element => {
            element.draw()
        })
        if(this._debug) this.debug()
    }

    debug(){
        textSize(20)
        fill(255,0,255)
        noStroke()
        text(`${this.level.name}\n${Math.round(frameRate())} FPS`, width / 2, 50)
    }
}
