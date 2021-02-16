import CheckPoint from "./elements/CheckPoint"
import Rectangle from "./primary/Rectangle"
import Platform from "./elements/Platform"
import Cursor from "./elements/Cursor"
import Player from "./elements/Player"
import Enemy from "./elements/Enemy"
import Level from "./elements/Level"
import Trap from "./elements/Trap"

export default class Party {
  public keys: { [key: string]: boolean } = {}
  public player: Player
  public cursor: Cursor
  public levels: Level[]
  public levelIndex = 0
  public debugMode = false

  constructor() {
    this.levels = [
      new Level(this, {
        spawn: {
          x: 60,
          y: 120,
        },
        name: "Level 1",
        polygons: [
          new Platform(0, 120),
          new Platform(400, 60),
          new Platform(0, -120),
          new Platform(-400, -180),
          new Platform(0, -400),
          new Platform(400, -360),
          new Platform(0, -600),
          new Platform(-400, -500),
          new Trap(-3000, 200, 6000, 500),
          new CheckPoint(500, 60),
          new CheckPoint(-300, -180),
        ],
        enemies: [new Enemy(0, 0, this, []), new Enemy(0, 0, this, [])],
      }),
    ]
    this.player = new Player(this)
    this.cursor = new Cursor(this)
  }

  get elements(): Rectangle[] {
    return [this.level, this.player, this.cursor].sort((a, b) => a.z - b.z)
  }

  get level() {
    return this.levels[this.levelIndex]
  }

  respawn() {
    this.level.x = 0
    this.level.y = 0
    this.player.set(this.level.spawns[0].x, this.level.spawns[0].y)
    this.player.velocity = {
      x: 0,
      y: 0,
    }
  }

  reset() {
    this.elements.forEach((element) => {
      element.reset()
    })
  }

  frame() {
    const distX = this.player.x - width / 2,
      distY = this.player.y - height / 2
    this.elements.forEach((element) => {
      element.x -= distX / 10
      element.y -= distY / 10
      element.frame()
    })
  }

  draw() {
    this.elements.forEach((element) => {
      element.draw()
    })
    if (this.debugMode) this.debug()
  }

  debug() {
    textSize(20)
    fill(255, 0, 255)
    noStroke()
    text(`${this.level.name}\n${Math.round(frameRate())} FPS`, width / 2, 50)
  }
}
