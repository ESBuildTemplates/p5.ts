import Polygon from "../primary/Polygon"
import drawTrap from "../drawings/drawTrap"

export default class Trap extends Polygon {
  draw() {
    drawTrap(this)
  }
}
