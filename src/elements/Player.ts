import MoveBox from "../primary/MoveBox"
import Party from "../Party"
import Polygon from "../primary/Polygon"
import Trap from "./Trap"
import drawPlayer from "../drawings/drawPlayer"

export default class Player extends MoveBox {
  public vitality = 3

  constructor(public party: Party) {
    super(
      party.level.spawns[0].x,
      party.level.spawns[0].y,
      2,
      new Polygon(-30, -120, 60, 60, 4), // tête
      new Polygon(-30, -60, 15, 30, 1), // bras gauche
      new Polygon(15, -60, 15, 30, 1), // bras droit
      new Polygon(-15, -60, 30, 30, 3), // torse
      new Polygon(-15, -30, 15, 30, 2), // jambe gauche
      new Polygon(0, -30, 15, 30, 2) // jambe droite
    )
  }

  reset() {
    this.vitality = 3
    this.party.respawn()
  }

  frame() {
    // crop velocity
    if (this.velocity.y > 1) this.velocity.y = 1
    if (this.velocity.y < -1) this.velocity.y = -1
    if (this.velocity.x > 1) this.velocity.x = 1
    if (this.velocity.x < -1) this.velocity.x = -1
    if (this.velocity.x > -0.1 && this.velocity.x < 0.1) {
      this.velocity.x = 0
    }

    // apply move X,Y
    this.x += this.speed.x * this.velocity.x
    this.y += this.speed.y * this.velocity.y

    // jump flow
    if (
      this.party.keys["32"] &&
      this.jumpProgress &&
      this.jumpHeight < this.jumpMaxHeight
    ) {
      this.velocity.y -= 0.1
    } else {
      this.jumpProgress = false
    }
    this.jumpHeight += this.speed.y * this.velocity.y * -1

    // fall flow
    if (this.onGround() && this.velocity.y >= 0) {
      this.velocity.y = 0
      this.jumpHeight = 0
      while (this.onGround()) {
        this.y--
      }
      this.y++
    } else {
      this.fall()
    }

    // horizontal move flow
    if (!this.party.keys["37"] == !this.party.keys["39"]) {
      this.velocity.x *= 0.5
    }
    if (this.party.keys["37"]) {
      this.velocity.x -= 0.2
    }
    if (this.party.keys["39"]) {
      this.velocity.x += 0.2
    }

    // deadly fall
    if (
      this.touch(
        ...this.party.level.children.filter((child) => child instanceof Trap)
      )
    ) {
      this.vitality--
      this.party.respawn()
      if (this.vitality < 0) {
        this.party.reset()
      }
    }
  }

  draw() {
    drawPlayer(this)
  }
}
