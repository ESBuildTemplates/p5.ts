
class Enemy extends MoveBox {
    
    constructor( x, y, party, pattern ){

        super( 
            x, y, 0,
            new Polygon( -60, -90, 120, 60, 1 ), // tete
            new Polygon( -45, -30, 30, 30, 1 ),
        )

        this.party = party
        this.pattern = pattern
    }
    
}