import Player from "../elements/Player"

export default function drawPlayer(player: Player) {
  const [
    tete,
    brasGauche,
    brasDroit,
    torse,
    jambeGauche,
    jambeDroite,
  ] = player.children

  // tete
  let centerX = tete.centerX + player.velocity.x * 8,
    top = tete.top,
    bottom = tete.bottom

  if (player.party.keys["38"]) {
    top -= 5
    bottom -= 5
  }
  if (player.party.keys["40"]) {
    top += 5
    bottom += 5
  }
  strokeWeight(5)
  stroke(0)
  fill(255)
  rect(tete.left, tete.top, tete.width, tete.height, tete.width / 5)

  const lifes = player.vitality

  // yeux
  noFill()
  if (lifes == 0) {
    line(centerX - 15, top + 15, centerX - 5, top + 30)
    line(centerX - 5, top + 15, centerX - 15, top + 30)
    line(centerX + 15, top + 15, centerX + 5, top + 30)
    line(centerX + 5, top + 15, centerX + 15, top + 30)
  } else {
    line(centerX - 10, top + 15, centerX - 10, top + 30)
    line(centerX + 10, top + 15, centerX + 10, top + 30)
  }

  // bouche
  if (lifes >= 3) {
    bezier(
      centerX - 10,
      bottom - 15,
      centerX - 5,
      bottom - 10,
      centerX + 5,
      bottom - 10,
      centerX + 10,
      bottom - 15
    )
  } else if (lifes == 2) {
    line(centerX - 8, bottom - 15, centerX + 8, bottom - 15)
  } else if (lifes == 1) {
    bezier(
      centerX - 10,
      bottom - 10,
      centerX - 5,
      bottom - 15,
      centerX + 5,
      bottom - 15,
      centerX + 10,
      bottom - 10
    )
  } else {
    bezier(
      centerX - 10,
      bottom - 10,
      centerX - 5,
      bottom - 20,
      centerX + 5,
      bottom - 20,
      centerX + 10,
      bottom - 10
    )
    line(centerX - 10, bottom - 10, centerX + 10, bottom - 10)
  }

  // bras gauche
  fill(255)
  angleMode(RADIANS)
  push()
  translate(brasGauche.centerX, brasGauche.top + 5)
  rotate(Math.max(player.velocity.x / 3, 0))
  translate(-brasGauche.centerX, -(brasGauche.top + 5))
  rect(
    brasGauche.left,
    brasGauche.top,
    brasGauche.width,
    brasGauche.height,
    brasGauche.width / 2,
    0,
    0,
    brasGauche.width / 2
  )
  pop()

  // bras droit
  push()
  translate(brasDroit.centerX, brasDroit.top + 5)
  rotate(Math.min(player.velocity.x / 3, 0))
  translate(-brasDroit.centerX, -(brasDroit.top + 5))
  rect(
    brasDroit.left,
    brasDroit.top,
    brasDroit.width,
    brasDroit.height,
    0,
    brasGauche.width / 2,
    brasGauche.width / 2,
    0
  )
  pop()

  // torse
  rect(
    torse.left,
    torse.top,
    torse.width,
    torse.height,
    0,
    0,
    torse.width / 4,
    torse.width / 4
  )

  // jambe gauche
  push()
  translate(jambeGauche.centerX, jambeGauche.top + 5)
  rotate(
    Math.max(
      map(player.jumpHeight, 0, player.jumpMaxHeight, 0, 0.5) +
        player.velocity.x / 10,
      0
    )
  )
  translate(-jambeGauche.centerX, -(jambeGauche.top + 5))
  rect(
    jambeGauche.left,
    jambeGauche.top,
    jambeGauche.width,
    jambeGauche.height,
    jambeGauche.width / 2,
    jambeGauche.width / 2,
    0,
    0
  )
  pop()

  // jambe droite
  push()
  translate(jambeDroite.centerX, jambeDroite.top + 5)
  rotate(
    Math.min(
      map(player.jumpHeight, 0, player.jumpMaxHeight, 0, -0.5) +
        player.velocity.x / 10,
      0
    )
  )
  translate(-jambeDroite.centerX, -(jambeDroite.top + 5))
  rect(
    jambeDroite.left,
    jambeDroite.top,
    jambeDroite.width,
    jambeDroite.height,
    jambeDroite.width / 2,
    jambeDroite.width / 2,
    0,
    0
  )
  pop()
}
