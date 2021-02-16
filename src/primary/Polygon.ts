import Rectangle from "./Rectangle"

export default class Polygon extends Rectangle {
  public parent: any
  public debugMode = false

  constructor(
    public relX: number,
    public relY: number,
    public width: number,
    public height: number,
    public relZ = 1
  ) {
    super()
  }

  get x(): number {
    return this.left
  }
  get y(): number {
    return this.top
  }
  get z(): number {
    return
  }
  get left() {
    return this.parent.x + this.relX
  }
  get top() {
    return this.parent.y + this.relY
  }
  get right() {
    return this.left + this.width
  }
  get bottom() {
    return this.top + this.height
  }
  get centerX() {
    return this.left + this.width / 2
  }
  get centerY() {
    return this.top + this.height / 2
  }

  draw() {
    fill(255)
    stroke(0)
    strokeWeight(5)
    rect(this.left, this.top, this.width, this.height, this.height / 3)
    super.draw()
  }
}
