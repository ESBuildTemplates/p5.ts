
class HitBox extends Box {

    touch( ...resolvables ){
        return resolvables.find( resolvable => {
            return resolvable.touch( ...this.polygons )
        })
    }
}