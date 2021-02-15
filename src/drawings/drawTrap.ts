import Trap from "../elements/Trap"

export default function drawTrap(trap: Trap) {
  fill(255, 0, 0)
  stroke(255, 98, 0)
  strokeWeight(random(1, trap.height / 10))
  rect(trap.left, trap.top, trap.width, trap.height, trap.height / 3)
  stroke(255, 217, 0)
  strokeWeight(random(1, trap.height / 20))
  rect(trap.left, trap.top, trap.width, trap.height, trap.height / 3)
  noStroke()
  for (var i = 0; i < (trap.height + trap.width) / 100; i++) {
    let size = random(5, 15)
    fill(255, 100, 30)
    rect(
      random(trap.left, trap.right),
      random(trap.top, trap.bottom),
      size,
      size
    )
    size = random(5, 15)
    fill(10)
    rect(
      random(trap.left, trap.right),
      random(trap.top, trap.bottom),
      size,
      size
    )
  }
}
