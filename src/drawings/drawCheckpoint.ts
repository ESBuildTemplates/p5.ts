import CheckPoint from "../elements/Checkpoint"

export default function drawCheckpoint(cp: CheckPoint) {
  strokeWeight(5)
  stroke(0)
  if (!cp.obtained) {
    fill(100, 100, 255)
    rect(cp.left + 10, cp.top + 5, cp.width - 10, cp.height / 2)
  } else {
  }
  fill(100)
  rect(cp.left, cp.top, 10, cp.height, 5, 5, 0, 0)
}
