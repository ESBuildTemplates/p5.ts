import Polygon from "../primary/Polygon"

export default class Platform extends Polygon {
  constructor(relX: number, relY: number, width = 200, height = 10, relZ = 1) {
    super(relX, relY, width, height, relZ)
  }
}
