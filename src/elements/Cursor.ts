import HitBox from "../primary/HitBox"
import Polygon from "../primary/Polygon"
import Party from "../Party"

export default class Cursor extends HitBox {
  constructor(public party: Party) {
    super(0, 0, 20, new Polygon(0, 0, 15, 15))
  }

  frame() {
    this.x = mouseX
    this.y = mouseY
  }

  draw() {
    strokeWeight(5)
    fill(255)
    stroke(0)
    rect(
      this.x,
      this.y,
      this.width,
      this.height,
      0,
      this.width / 2,
      this.width / 2,
      this.width / 2
    )
    if (this.debugMode) this.debug()
  }

  debug() {
    // TODO: afficher X et Y du point pointé
  }
}
