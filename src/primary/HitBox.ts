import Rectangle from "./Rectangle"

export default class HitBox extends Rectangle {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    ...children: Rectangle[]
  ) {
    super()
    this.addChildren(...children)
  }

  get left() {
    return Math.min(...this.children.map((child) => child.left))
  }
  get top() {
    return Math.min(...this.children.map((child) => child.top))
  }
  get right() {
    return Math.max(...this.children.map((child) => child.right))
  }
  get bottom() {
    return Math.max(...this.children.map((child) => child.bottom))
  }
  get width() {
    return this.right - this.left
  }
  get height() {
    return this.bottom - this.top
  }
  get centerX() {
    return this.left + this.width / 2
  }
  get centerY() {
    return this.top + this.height / 2
  }
}
