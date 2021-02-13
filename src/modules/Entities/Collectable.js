import Entity from "../Entity"

export class Collectable extends Entity {
  constructor(options) {
    super(options)

    this.onCollected = options.onCollected

    // Reset
    const reset = () => {
      this.isCollected = false
      this.isDraw = !!this.onDraw
    }
    this.resets.push(reset)
    reset()
  }

  collect() {
    this.isCollected = true
    this.isDraw = false
  }
}
