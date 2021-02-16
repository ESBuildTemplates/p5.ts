import HitBox from "../primary/HitBox"
import Vector from "../types/Vector"
import Party from "../Party"
import Enemy from "./Enemy"
import Polygon from "../primary/Polygon"
import LevelOptions from "../types/LevelOptions"

export default class Level extends HitBox {
  public party: Party
  public name: string
  public spawns: Vector[]
  public enemies: Enemy[]

  constructor(party: Party, options: LevelOptions) {
    super(0, 0, 1, ...options.polygons)
    this.party = party
    this.name = options.name
    this.enemies = options.enemies
    this.spawns = [options.spawn]
  }

  addSpawn(polygon: Polygon) {
    this.spawns.unshift({
      x: polygon.relX + 30,
      y: polygon.relY + 60,
    })
  }

  reset() {
    this.x = 0
    this.y = 0
    this.spawns = [this.spawns.pop()]
    super.reset()
  }
}
