import Polygon from "../primary/Polygon"
import HitBox from "../primary/HitBox"

export default class Button extends HitBox {
  constructor(
    x: number,
    y: number,
    public text: string,
    public callback: () => unknown
  ) {
    super(x, y, 9, new Polygon(-60, -15, 120, 30))
  }
}
