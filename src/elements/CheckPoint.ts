import Polygon from "../primary/Polygon"
import drawCheckpoint from "../drawings/drawCheckpoint"

export default class CheckPoint extends Polygon {
  public obtained = false

  constructor(x: number, y: number) {
    super(x + 30, y - 60, 60, 60)
  }

  frame() {
    if (!this.obtained && this.touch(this.parent.party.player)) {
      this.obtained = true
      this.parent.addSpawn(this)
    }
  }

  reset() {
    this.obtained = false
  }

  draw() {
    drawCheckpoint(this)
  }
}
