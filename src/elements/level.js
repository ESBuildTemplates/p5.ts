
class Level extends HitBox {

    constructor( party, options ){
        super( 0, 0, 1, ...options.polygons)
        this.party = party
        this.name = options.name
        this.enemies = options.enemies
        this.spawns = [options.spawn]
    }

    addSpawn( element ){
        this.spawns.unshift({
            x : element.relX + 30, 
            y : element.relY + 60
        })
    }

    reset(){
        this.x = 0
        this.y = 0
        this.spawns = [this.spawns.pop()]
        this.polygons.forEach( polygon => {
            polygon.reset()
        })
    }
}