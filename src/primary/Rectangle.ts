import drawDebug from "../drawings/drawDebug"

export default abstract class Rectangle {
  public children: Rectangle[] = []
  public debugMode = false
  public parent?: Rectangle

  abstract x: number
  abstract y: number
  abstract z: number
  abstract left: number
  abstract top: number
  abstract right: number
  abstract bottom: number
  abstract width: number
  abstract height: number
  abstract centerX: number
  abstract centerY: number

  reset() {
    for (const child of this.children) child.reset()
  }
  frame() {
    for (const child of this.children) child.frame()
  }
  draw() {
    for (const child of this.children) child.draw()
  }
  debug() {
    drawDebug(this)
    for (const child of this.children) child.debug()
  }

  touch(...rectangles: Rectangle[]): boolean {
    return rectangles.some((resolvable) => {
      return Rectangle.touch(resolvable, this)
    })
  }

  addChildren(...children: Rectangle[]) {
    for (const child of children) {
      this.addChild(child)
    }
  }

  addChild(child: Rectangle) {
    this.children.push(child)
    child.parent = this
  }

  static touch(r1: Rectangle, r2: Rectangle) {
    return (
      r1.left < r2.right &&
      r1.right > r2.left &&
      r1.top < r2.bottom &&
      r1.bottom > r2.top
    )
  }
}
