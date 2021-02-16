import Rectangle from "../primary/Rectangle"

export default function drawDebug(rectangle: Rectangle) {
  noFill()
  strokeWeight(1)
  stroke(0, 0, 255)
  rect(rectangle.left, rectangle.top, rectangle.width, rectangle.height)
  line(rectangle.left, rectangle.top, rectangle.right, rectangle.bottom)
  line(rectangle.right, rectangle.top, rectangle.left, rectangle.bottom)
  noStroke()
  fill(0, 255, 0)
  textAlign(RIGHT, BOTTOM)
  text(
    `${rectangle.constructor.name}\nX:${Math.round(
      rectangle.x
    )}px Y:${Math.round(rectangle.y)}px\nWidth:${Math.round(
      rectangle.width
    )}px Height:${Math.round(rectangle.height)}px\nTop:${Math.round(
      rectangle.top
    )}px Left:${Math.round(rectangle.left)}`,
    Math.round(rectangle.centerX),
    Math.round(rectangle.top)
  )
}
