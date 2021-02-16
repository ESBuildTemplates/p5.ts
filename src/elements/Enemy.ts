import MoveBox from "../primary/MoveBox"
import Polygon from "../primary/Polygon"
import Party from "../Party"

export default class Enemy extends MoveBox {
  constructor(x: number, y: number, public party: Party, public pattern: any) {
    super(
      x,
      y,
      0,
      new Polygon(-60, -90, 120, 60, 1), // tete
      new Polygon(-45, -30, 30, 30, 1)
    )
  }
}
