import HitBox from "./HitBox"
import Party from "../Party"
import Platform from "../elements/Platform"
import Rectangle from "./Rectangle"
import Wall from "../elements/Wall"

export default class MoveBox extends HitBox {
  public party: Party
  public jumpProgress = false
  public jumpMaxHeight = 150
  public jumpHeight = 0
  public speed = { x: 10, y: 15 }
  public velocity = { x: 0, y: 0 }

  set(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setBottom(x: number, y: number) {
    this.x = x + this.width / 2
    this.y = y - this.height
  }

  add(x: number, y: number) {
    this.x += x
    this.y += y
  }

  initJump() {
    if (this.onGround()) {
      this.velocity.y = -1
      this.jumpProgress = true
      this.jumpHeight = 0
    }
  }

  onGround() {
    let bottom = -Infinity
    let foots: Rectangle[] = []
    this.children.forEach((child) => {
      if (bottom < child.bottom) {
        bottom = child.bottom
        foots = [child]
      } else if (bottom == child.bottom) {
        foots.push(child)
      }
    })
    return this.party.level.children
      .filter((polygon) => {
        return polygon instanceof Platform || polygon instanceof Wall
      })
      .some((polygon) => {
        return foots.some((jambe) => {
          return (
            jambe.bottom > polygon.top &&
            jambe.top < polygon.top &&
            jambe.right > polygon.left &&
            jambe.left < polygon.right
          )
        })
      })
  }

  fall() {
    this.velocity.y += 0.1
  }
}
