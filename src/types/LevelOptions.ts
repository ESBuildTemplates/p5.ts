import Enemy from "../elements/Enemy"
import Polygon from "../primary/Polygon"
import Vector from "./Vector"

export default interface LevelOptions {
  spawn: Vector
  name: string
  polygons: Polygon[]
  enemies: Enemy[]
}
