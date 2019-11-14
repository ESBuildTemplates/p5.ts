

class LevelEditor {

    constructor(){
        this.name = 'New project'
        this.polygons = []
        this.enemies = []
    }

    save(){
        console.log( JSON.stringify( {
            name : this.name,
            polygons : this.polygons,
            enemies : this.enemies
        }, null, 4 ))
    }

    addPolygon(type){
        this.polygons.push(new Wall(mouseX,mouseY,100,100,0))
    }

    changeType(id,type){
        
    }

    movePolygon(id){

    }

    movePlayer(){

    }

    select(x,y,w,h){

    }
}