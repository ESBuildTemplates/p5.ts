var Gario = (() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    draw: () => draw,
    keyPressed: () => keyPressed,
    keyReleased: () => keyReleased,
    setup: () => setup
  });

  // src/drawings/drawDebug.ts
  function drawDebug(rectangle) {
    noFill();
    strokeWeight(1);
    stroke(0, 0, 255);
    rect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
    line(rectangle.left, rectangle.top, rectangle.right, rectangle.bottom);
    line(rectangle.right, rectangle.top, rectangle.left, rectangle.bottom);
    noStroke();
    fill(0, 255, 0);
    textAlign(RIGHT, BOTTOM);
    text(`${rectangle.constructor.name}
X:${Math.round(rectangle.x)}px Y:${Math.round(rectangle.y)}px
Width:${Math.round(rectangle.width)}px Height:${Math.round(rectangle.height)}px
Top:${Math.round(rectangle.top)}px Left:${Math.round(rectangle.left)}`, Math.round(rectangle.centerX), Math.round(rectangle.top));
  }

  // src/primary/Rectangle.ts
  var Rectangle = class {
    constructor() {
      this.children = [];
      this.debugMode = false;
    }
    reset() {
      for (const child of this.children)
        child.reset();
    }
    frame() {
      for (const child of this.children)
        child.frame();
    }
    draw() {
      for (const child of this.children)
        child.draw();
    }
    debug() {
      drawDebug(this);
      for (const child of this.children)
        child.debug();
    }
    touch(...rectangles) {
      return rectangles.some((resolvable) => {
        return Rectangle.touch(resolvable, this);
      });
    }
    addChildren(...children) {
      for (const child of children) {
        this.addChild(child);
      }
    }
    addChild(child) {
      this.children.push(child);
      child.parent = this;
    }
    static touch(r1, r2) {
      return r1.left < r2.right && r1.right > r2.left && r1.top < r2.bottom && r1.bottom > r2.top;
    }
  };
  var Rectangle_default = Rectangle;

  // src/primary/Polygon.ts
  var Polygon = class extends Rectangle_default {
    constructor(relX, relY, width2, height2, relZ = 1) {
      super();
      this.relX = relX;
      this.relY = relY;
      this.width = width2;
      this.height = height2;
      this.relZ = relZ;
      this.debugMode = false;
    }
    get x() {
      return this.left;
    }
    get y() {
      return this.top;
    }
    get z() {
      return;
    }
    get left() {
      return this.parent.x + this.relX;
    }
    get top() {
      return this.parent.y + this.relY;
    }
    get right() {
      return this.left + this.width;
    }
    get bottom() {
      return this.top + this.height;
    }
    get centerX() {
      return this.left + this.width / 2;
    }
    get centerY() {
      return this.top + this.height / 2;
    }
    draw() {
      fill(255);
      stroke(0);
      strokeWeight(5);
      rect(this.left, this.top, this.width, this.height, this.height / 3);
      super.draw();
    }
  };
  var Polygon_default = Polygon;

  // src/drawings/drawCheckpoint.ts
  function drawCheckpoint(cp) {
    strokeWeight(5);
    stroke(0);
    if (!cp.obtained) {
      fill(100, 100, 255);
      rect(cp.left + 10, cp.top + 5, cp.width - 10, cp.height / 2);
    } else {
    }
    fill(100);
    rect(cp.left, cp.top, 10, cp.height, 5, 5, 0, 0);
  }

  // src/elements/CheckPoint.ts
  var CheckPoint = class extends Polygon_default {
    constructor(x, y) {
      super(x + 30, y - 60, 60, 60);
      this.obtained = false;
    }
    frame() {
      if (!this.obtained && this.touch(this.parent.party.player)) {
        this.obtained = true;
        this.parent.addSpawn(this);
      }
    }
    reset() {
      this.obtained = false;
    }
    draw() {
      drawCheckpoint(this);
    }
  };
  var CheckPoint_default = CheckPoint;

  // src/elements/Platform.ts
  var Platform = class extends Polygon_default {
    constructor(relX, relY, width2 = 200, height2 = 10, relZ = 1) {
      super(relX, relY, width2, height2, relZ);
    }
  };
  var Platform_default = Platform;

  // src/primary/HitBox.ts
  var HitBox = class extends Rectangle_default {
    constructor(x, y, z, ...children) {
      super();
      this.x = x;
      this.y = y;
      this.z = z;
      this.addChildren(...children);
    }
    get left() {
      return Math.min(...this.children.map((child) => child.left));
    }
    get top() {
      return Math.min(...this.children.map((child) => child.top));
    }
    get right() {
      return Math.max(...this.children.map((child) => child.right));
    }
    get bottom() {
      return Math.max(...this.children.map((child) => child.bottom));
    }
    get width() {
      return this.right - this.left;
    }
    get height() {
      return this.bottom - this.top;
    }
    get centerX() {
      return this.left + this.width / 2;
    }
    get centerY() {
      return this.top + this.height / 2;
    }
  };
  var HitBox_default = HitBox;

  // src/elements/Cursor.ts
  var Cursor = class extends HitBox_default {
    constructor(party2) {
      super(0, 0, 20, new Polygon_default(0, 0, 15, 15));
      this.party = party2;
    }
    frame() {
      this.x = mouseX;
      this.y = mouseY;
    }
    draw() {
      strokeWeight(5);
      fill(255);
      stroke(0);
      rect(this.x, this.y, this.width, this.height, 0, this.width / 2, this.width / 2, this.width / 2);
      if (this.debugMode)
        this.debug();
    }
    debug() {
    }
  };
  var Cursor_default = Cursor;

  // src/elements/Wall.ts
  var Wall = class extends Polygon_default {
  };
  var Wall_default = Wall;

  // src/primary/MoveBox.ts
  var MoveBox = class extends HitBox_default {
    constructor() {
      super(...arguments);
      this.jumpProgress = false;
      this.jumpMaxHeight = 150;
      this.jumpHeight = 0;
      this.speed = {x: 10, y: 15};
      this.velocity = {x: 0, y: 0};
    }
    set(x, y) {
      this.x = x;
      this.y = y;
    }
    setBottom(x, y) {
      this.x = x + this.width / 2;
      this.y = y - this.height;
    }
    add(x, y) {
      this.x += x;
      this.y += y;
    }
    initJump() {
      if (this.onGround()) {
        this.velocity.y = -1;
        this.jumpProgress = true;
        this.jumpHeight = 0;
      }
    }
    onGround() {
      let bottom = -Infinity;
      let foots = [];
      this.children.forEach((child) => {
        if (bottom < child.bottom) {
          bottom = child.bottom;
          foots = [child];
        } else if (bottom == child.bottom) {
          foots.push(child);
        }
      });
      return this.party.level.children.filter((polygon) => {
        return polygon instanceof Platform_default || polygon instanceof Wall_default;
      }).some((polygon) => {
        return foots.some((jambe) => {
          return jambe.bottom > polygon.top && jambe.top < polygon.top && jambe.right > polygon.left && jambe.left < polygon.right;
        });
      });
    }
    fall() {
      this.velocity.y += 0.1;
    }
  };
  var MoveBox_default = MoveBox;

  // src/drawings/drawTrap.ts
  function drawTrap(trap) {
    fill(255, 0, 0);
    stroke(255, 98, 0);
    strokeWeight(random(1, trap.height / 10));
    rect(trap.left, trap.top, trap.width, trap.height, trap.height / 3);
    stroke(255, 217, 0);
    strokeWeight(random(1, trap.height / 20));
    rect(trap.left, trap.top, trap.width, trap.height, trap.height / 3);
    noStroke();
    for (var i = 0; i < (trap.height + trap.width) / 100; i++) {
      let size = random(5, 15);
      fill(255, 100, 30);
      rect(random(trap.left, trap.right), random(trap.top, trap.bottom), size, size);
      size = random(5, 15);
      fill(10);
      rect(random(trap.left, trap.right), random(trap.top, trap.bottom), size, size);
    }
  }

  // src/elements/Trap.ts
  var Trap = class extends Polygon_default {
    draw() {
      drawTrap(this);
    }
  };
  var Trap_default = Trap;

  // src/drawings/drawPlayer.ts
  function drawPlayer(player) {
    const [
      tete,
      brasGauche,
      brasDroit,
      torse,
      jambeGauche,
      jambeDroite
    ] = player.children;
    let centerX = tete.centerX + player.velocity.x * 8, top = tete.top, bottom = tete.bottom;
    if (player.party.keys["38"]) {
      top -= 5;
      bottom -= 5;
    }
    if (player.party.keys["40"]) {
      top += 5;
      bottom += 5;
    }
    strokeWeight(5);
    stroke(0);
    fill(255);
    rect(tete.left, tete.top, tete.width, tete.height, tete.width / 5);
    const lifes = player.vitality;
    noFill();
    if (lifes == 0) {
      line(centerX - 15, top + 15, centerX - 5, top + 30);
      line(centerX - 5, top + 15, centerX - 15, top + 30);
      line(centerX + 15, top + 15, centerX + 5, top + 30);
      line(centerX + 5, top + 15, centerX + 15, top + 30);
    } else {
      line(centerX - 10, top + 15, centerX - 10, top + 30);
      line(centerX + 10, top + 15, centerX + 10, top + 30);
    }
    if (lifes >= 3) {
      bezier(centerX - 10, bottom - 15, centerX - 5, bottom - 10, centerX + 5, bottom - 10, centerX + 10, bottom - 15);
    } else if (lifes == 2) {
      line(centerX - 8, bottom - 15, centerX + 8, bottom - 15);
    } else if (lifes == 1) {
      bezier(centerX - 10, bottom - 10, centerX - 5, bottom - 15, centerX + 5, bottom - 15, centerX + 10, bottom - 10);
    } else {
      bezier(centerX - 10, bottom - 10, centerX - 5, bottom - 20, centerX + 5, bottom - 20, centerX + 10, bottom - 10);
      line(centerX - 10, bottom - 10, centerX + 10, bottom - 10);
    }
    fill(255);
    angleMode(RADIANS);
    push();
    translate(brasGauche.centerX, brasGauche.top + 5);
    rotate(Math.max(player.velocity.x / 3, 0));
    translate(-brasGauche.centerX, -(brasGauche.top + 5));
    rect(brasGauche.left, brasGauche.top, brasGauche.width, brasGauche.height, brasGauche.width / 2, 0, 0, brasGauche.width / 2);
    pop();
    push();
    translate(brasDroit.centerX, brasDroit.top + 5);
    rotate(Math.min(player.velocity.x / 3, 0));
    translate(-brasDroit.centerX, -(brasDroit.top + 5));
    rect(brasDroit.left, brasDroit.top, brasDroit.width, brasDroit.height, 0, brasGauche.width / 2, brasGauche.width / 2, 0);
    pop();
    rect(torse.left, torse.top, torse.width, torse.height, 0, 0, torse.width / 4, torse.width / 4);
    push();
    translate(jambeGauche.centerX, jambeGauche.top + 5);
    rotate(Math.max(map(player.jumpHeight, 0, player.jumpMaxHeight, 0, 0.5) + player.velocity.x / 10, 0));
    translate(-jambeGauche.centerX, -(jambeGauche.top + 5));
    rect(jambeGauche.left, jambeGauche.top, jambeGauche.width, jambeGauche.height, jambeGauche.width / 2, jambeGauche.width / 2, 0, 0);
    pop();
    push();
    translate(jambeDroite.centerX, jambeDroite.top + 5);
    rotate(Math.min(map(player.jumpHeight, 0, player.jumpMaxHeight, 0, -0.5) + player.velocity.x / 10, 0));
    translate(-jambeDroite.centerX, -(jambeDroite.top + 5));
    rect(jambeDroite.left, jambeDroite.top, jambeDroite.width, jambeDroite.height, jambeDroite.width / 2, jambeDroite.width / 2, 0, 0);
    pop();
  }

  // src/elements/Player.ts
  var Player = class extends MoveBox_default {
    constructor(party2) {
      super(party2.level.spawns[0].x, party2.level.spawns[0].y, 2, new Polygon_default(-30, -120, 60, 60, 4), new Polygon_default(-30, -60, 15, 30, 1), new Polygon_default(15, -60, 15, 30, 1), new Polygon_default(-15, -60, 30, 30, 3), new Polygon_default(-15, -30, 15, 30, 2), new Polygon_default(0, -30, 15, 30, 2));
      this.party = party2;
      this.vitality = 3;
    }
    reset() {
      this.vitality = 3;
      this.party.respawn();
    }
    frame() {
      if (this.velocity.y > 1)
        this.velocity.y = 1;
      if (this.velocity.y < -1)
        this.velocity.y = -1;
      if (this.velocity.x > 1)
        this.velocity.x = 1;
      if (this.velocity.x < -1)
        this.velocity.x = -1;
      if (this.velocity.x > -0.1 && this.velocity.x < 0.1) {
        this.velocity.x = 0;
      }
      this.x += this.speed.x * this.velocity.x;
      this.y += this.speed.y * this.velocity.y;
      if (this.party.keys["32"] && this.jumpProgress && this.jumpHeight < this.jumpMaxHeight) {
        this.velocity.y -= 0.1;
      } else {
        this.jumpProgress = false;
      }
      this.jumpHeight += this.speed.y * this.velocity.y * -1;
      if (this.onGround() && this.velocity.y >= 0) {
        this.velocity.y = 0;
        this.jumpHeight = 0;
        while (this.onGround()) {
          this.y--;
        }
        this.y++;
      } else {
        this.fall();
      }
      if (!this.party.keys["37"] == !this.party.keys["39"]) {
        this.velocity.x *= 0.5;
      }
      if (this.party.keys["37"]) {
        this.velocity.x -= 0.2;
      }
      if (this.party.keys["39"]) {
        this.velocity.x += 0.2;
      }
      if (this.touch(...this.party.level.children.filter((child) => child instanceof Trap_default))) {
        this.vitality--;
        this.party.respawn();
        if (this.vitality < 0) {
          this.party.reset();
        }
      }
    }
    draw() {
      drawPlayer(this);
    }
  };
  var Player_default = Player;

  // src/elements/Enemy.ts
  var Enemy = class extends MoveBox_default {
    constructor(x, y, party2, pattern) {
      super(x, y, 0, new Polygon_default(-60, -90, 120, 60, 1), new Polygon_default(-45, -30, 30, 30, 1));
      this.party = party2;
      this.pattern = pattern;
    }
  };
  var Enemy_default = Enemy;

  // src/elements/Level.ts
  var Level = class extends HitBox_default {
    constructor(party2, options) {
      super(0, 0, 1, ...options.polygons);
      this.party = party2;
      this.name = options.name;
      this.enemies = options.enemies;
      this.spawns = [options.spawn];
    }
    addSpawn(polygon) {
      this.spawns.unshift({
        x: polygon.relX + 30,
        y: polygon.relY + 60
      });
    }
    reset() {
      this.x = 0;
      this.y = 0;
      this.spawns = [this.spawns.pop()];
      super.reset();
    }
  };
  var Level_default = Level;

  // src/Party.ts
  var Party = class {
    constructor() {
      this.keys = {};
      this.levelIndex = 0;
      this.debugMode = false;
      this.levels = [
        new Level_default(this, {
          spawn: {
            x: 60,
            y: 120
          },
          name: "Level 1",
          polygons: [
            new Platform_default(0, 120),
            new Platform_default(400, 60),
            new Platform_default(0, -120),
            new Platform_default(-400, -180),
            new Platform_default(0, -400),
            new Platform_default(400, -360),
            new Platform_default(0, -600),
            new Platform_default(-400, -500),
            new Trap_default(-3e3, 200, 6e3, 500),
            new CheckPoint_default(500, 60),
            new CheckPoint_default(-300, -180)
          ],
          enemies: [new Enemy_default(0, 0, this, []), new Enemy_default(0, 0, this, [])]
        })
      ];
      this.player = new Player_default(this);
      this.cursor = new Cursor_default(this);
    }
    get elements() {
      return [this.level, this.player, this.cursor].sort((a, b) => a.z - b.z);
    }
    get level() {
      return this.levels[this.levelIndex];
    }
    respawn() {
      this.level.x = 0;
      this.level.y = 0;
      this.player.set(this.level.spawns[0].x, this.level.spawns[0].y);
      this.player.velocity = {
        x: 0,
        y: 0
      };
    }
    reset() {
      this.elements.forEach((element) => {
        element.reset();
      });
    }
    frame() {
      const distX = this.player.x - width / 2, distY = this.player.y - height / 2;
      this.elements.forEach((element) => {
        element.x -= distX / 10;
        element.y -= distY / 10;
        element.frame();
      });
    }
    draw() {
      this.elements.forEach((element) => {
        element.draw();
      });
      if (this.debugMode)
        this.debug();
    }
    debug() {
      textSize(20);
      fill(255, 0, 255);
      noStroke();
      text(`${this.level.name}
${Math.round(frameRate())} FPS`, width / 2, 50);
    }
  };
  var Party_default = Party;

  // src/index.ts
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  var party;
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    frameRate(50);
    party = new Party_default();
  }
  function draw() {
    party.frame();
    background(20);
    party.draw();
  }
  function keyPressed() {
    party.keys[String(keyCode)] = true;
    if (keyCode == 32) {
      party.player.initJump();
    }
  }
  function keyReleased() {
    party.keys[String(keyCode)] = false;
  }
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9kcmF3aW5ncy9kcmF3RGVidWcudHMiLCAic3JjL3ByaW1hcnkvUmVjdGFuZ2xlLnRzIiwgInNyYy9wcmltYXJ5L1BvbHlnb24udHMiLCAic3JjL2RyYXdpbmdzL2RyYXdDaGVja3BvaW50LnRzIiwgInNyYy9lbGVtZW50cy9DaGVja1BvaW50LnRzIiwgInNyYy9lbGVtZW50cy9QbGF0Zm9ybS50cyIsICJzcmMvcHJpbWFyeS9IaXRCb3gudHMiLCAic3JjL2VsZW1lbnRzL0N1cnNvci50cyIsICJzcmMvZWxlbWVudHMvV2FsbC50cyIsICJzcmMvcHJpbWFyeS9Nb3ZlQm94LnRzIiwgInNyYy9kcmF3aW5ncy9kcmF3VHJhcC50cyIsICJzcmMvZWxlbWVudHMvVHJhcC50cyIsICJzcmMvZHJhd2luZ3MvZHJhd1BsYXllci50cyIsICJzcmMvZWxlbWVudHMvUGxheWVyLnRzIiwgInNyYy9lbGVtZW50cy9FbmVteS50cyIsICJzcmMvZWxlbWVudHMvTGV2ZWwudHMiLCAic3JjL1BhcnR5LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLy8gQHRzLWNoZWNrXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9wNS9nbG9iYWwuZC50c1wiIC8+XG5cbmltcG9ydCBQYXJ0eSBmcm9tIFwiLi9QYXJ0eVwiXG4vLyBpbXBvcnQgQ3Vyc29yIGZyb20gXCIuL2VsZW1lbnRzL0N1cnNvclwiXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXZlbnQpID0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCkpXG5cbmxldCBwYXJ0eTogUGFydHlcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuICBmcmFtZVJhdGUoNTApXG4gIHBhcnR5ID0gbmV3IFBhcnR5KClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XG4gIHBhcnR5LmZyYW1lKClcbiAgYmFja2dyb3VuZCgyMClcbiAgcGFydHkuZHJhdygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge1xuICBwYXJ0eS5rZXlzW1N0cmluZyhrZXlDb2RlKV0gPSB0cnVlXG4gIGlmIChrZXlDb2RlID09IDMyKSB7XG4gICAgcGFydHkucGxheWVyLmluaXRKdW1wKClcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge1xuICBwYXJ0eS5rZXlzW1N0cmluZyhrZXlDb2RlKV0gPSBmYWxzZVxufVxuXG4vLyBmdW5jdGlvbiBtb3VzZVByZXNzZWQoKSB7XG4vLyAgIGxldCB0YXJnZXRcbi8vICAgaWYgKG1vdXNlQnV0dG9uID09PSBMRUZUKSB7XG4vLyAgICAgdGFyZ2V0ID0gcGFydHkuY3Vyc29yLnRvdWNoKFxuLy8gICAgICAgLi4ucGFydHkuZWxlbWVudHNcbi8vICAgICAgICAgLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuLy8gICAgICAgICAgIHJldHVybiAhKGVsZW1lbnQgaW5zdGFuY2VvZiBDdXJzb3IpXG4vLyAgICAgICAgIH0pXG4vLyAgICAgICAgIC5tYXAoKGVsZW1lbnQpID0+IHtcbi8vICAgICAgICAgICByZXR1cm4gZWxlbWVudC5wb2x5Z29uc1xuLy8gICAgICAgICB9KVxuLy8gICAgICAgICAuZmxhdCgpXG4vLyAgICAgKVxuLy8gICB9IGVsc2Uge1xuLy8gICAgIHRhcmdldCA9IHBhcnR5LmN1cnNvci50b3VjaChcbi8vICAgICAgIC4uLnBhcnR5LmVsZW1lbnRzLmZpbHRlcigoZWxlbWVudCkgPT4ge1xuLy8gICAgICAgICByZXR1cm4gIShlbGVtZW50IGluc3RhbmNlb2YgQ3Vyc29yKVxuLy8gICAgICAgfSlcbi8vICAgICApXG4vLyAgIH1cbi8vICAgaWYgKHRhcmdldCkge1xuLy8gICAgIHRhcmdldC5kZWJ1Z01vZGUgPSAhdGFyZ2V0LmRlYnVnTW9kZVxuLy8gICB9XG4vLyB9XG4iLCAiaW1wb3J0IFJlY3RhbmdsZSBmcm9tIFwiLi4vcHJpbWFyeS9SZWN0YW5nbGVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkcmF3RGVidWcocmVjdGFuZ2xlOiBSZWN0YW5nbGUpIHtcbiAgbm9GaWxsKClcbiAgc3Ryb2tlV2VpZ2h0KDEpXG4gIHN0cm9rZSgwLCAwLCAyNTUpXG4gIHJlY3QocmVjdGFuZ2xlLmxlZnQsIHJlY3RhbmdsZS50b3AsIHJlY3RhbmdsZS53aWR0aCwgcmVjdGFuZ2xlLmhlaWdodClcbiAgbGluZShyZWN0YW5nbGUubGVmdCwgcmVjdGFuZ2xlLnRvcCwgcmVjdGFuZ2xlLnJpZ2h0LCByZWN0YW5nbGUuYm90dG9tKVxuICBsaW5lKHJlY3RhbmdsZS5yaWdodCwgcmVjdGFuZ2xlLnRvcCwgcmVjdGFuZ2xlLmxlZnQsIHJlY3RhbmdsZS5ib3R0b20pXG4gIG5vU3Ryb2tlKClcbiAgZmlsbCgwLCAyNTUsIDApXG4gIHRleHRBbGlnbihSSUdIVCwgQk9UVE9NKVxuICB0ZXh0KFxuICAgIGAke3JlY3RhbmdsZS5jb25zdHJ1Y3Rvci5uYW1lfVxcblg6JHtNYXRoLnJvdW5kKFxuICAgICAgcmVjdGFuZ2xlLnhcbiAgICApfXB4IFk6JHtNYXRoLnJvdW5kKHJlY3RhbmdsZS55KX1weFxcbldpZHRoOiR7TWF0aC5yb3VuZChcbiAgICAgIHJlY3RhbmdsZS53aWR0aFxuICAgICl9cHggSGVpZ2h0OiR7TWF0aC5yb3VuZChyZWN0YW5nbGUuaGVpZ2h0KX1weFxcblRvcDoke01hdGgucm91bmQoXG4gICAgICByZWN0YW5nbGUudG9wXG4gICAgKX1weCBMZWZ0OiR7TWF0aC5yb3VuZChyZWN0YW5nbGUubGVmdCl9YCxcbiAgICBNYXRoLnJvdW5kKHJlY3RhbmdsZS5jZW50ZXJYKSxcbiAgICBNYXRoLnJvdW5kKHJlY3RhbmdsZS50b3ApXG4gIClcbn1cbiIsICJpbXBvcnQgZHJhd0RlYnVnIGZyb20gXCIuLi9kcmF3aW5ncy9kcmF3RGVidWdcIlxuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBSZWN0YW5nbGUge1xuICBwdWJsaWMgY2hpbGRyZW46IFJlY3RhbmdsZVtdID0gW11cbiAgcHVibGljIGRlYnVnTW9kZSA9IGZhbHNlXG4gIHB1YmxpYyBwYXJlbnQ/OiBSZWN0YW5nbGVcblxuICBhYnN0cmFjdCB4OiBudW1iZXJcbiAgYWJzdHJhY3QgeTogbnVtYmVyXG4gIGFic3RyYWN0IHo6IG51bWJlclxuICBhYnN0cmFjdCBsZWZ0OiBudW1iZXJcbiAgYWJzdHJhY3QgdG9wOiBudW1iZXJcbiAgYWJzdHJhY3QgcmlnaHQ6IG51bWJlclxuICBhYnN0cmFjdCBib3R0b206IG51bWJlclxuICBhYnN0cmFjdCB3aWR0aDogbnVtYmVyXG4gIGFic3RyYWN0IGhlaWdodDogbnVtYmVyXG4gIGFic3RyYWN0IGNlbnRlclg6IG51bWJlclxuICBhYnN0cmFjdCBjZW50ZXJZOiBudW1iZXJcblxuICByZXNldCgpIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIGNoaWxkLnJlc2V0KClcbiAgfVxuICBmcmFtZSgpIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIGNoaWxkLmZyYW1lKClcbiAgfVxuICBkcmF3KCkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikgY2hpbGQuZHJhdygpXG4gIH1cbiAgZGVidWcoKSB7XG4gICAgZHJhd0RlYnVnKHRoaXMpXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSBjaGlsZC5kZWJ1ZygpXG4gIH1cblxuICB0b3VjaCguLi5yZWN0YW5nbGVzOiBSZWN0YW5nbGVbXSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiByZWN0YW5nbGVzLnNvbWUoKHJlc29sdmFibGUpID0+IHtcbiAgICAgIHJldHVybiBSZWN0YW5nbGUudG91Y2gocmVzb2x2YWJsZSwgdGhpcylcbiAgICB9KVxuICB9XG5cbiAgYWRkQ2hpbGRyZW4oLi4uY2hpbGRyZW46IFJlY3RhbmdsZVtdKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgdGhpcy5hZGRDaGlsZChjaGlsZClcbiAgICB9XG4gIH1cblxuICBhZGRDaGlsZChjaGlsZDogUmVjdGFuZ2xlKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKVxuICAgIGNoaWxkLnBhcmVudCA9IHRoaXNcbiAgfVxuXG4gIHN0YXRpYyB0b3VjaChyMTogUmVjdGFuZ2xlLCByMjogUmVjdGFuZ2xlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHIxLmxlZnQgPCByMi5yaWdodCAmJlxuICAgICAgcjEucmlnaHQgPiByMi5sZWZ0ICYmXG4gICAgICByMS50b3AgPCByMi5ib3R0b20gJiZcbiAgICAgIHIxLmJvdHRvbSA+IHIyLnRvcFxuICAgIClcbiAgfVxufVxuIiwgImltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4vUmVjdGFuZ2xlXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9seWdvbiBleHRlbmRzIFJlY3RhbmdsZSB7XG4gIHB1YmxpYyBwYXJlbnQ6IGFueVxuICBwdWJsaWMgZGVidWdNb2RlID0gZmFsc2VcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVsWDogbnVtYmVyLFxuICAgIHB1YmxpYyByZWxZOiBudW1iZXIsXG4gICAgcHVibGljIHdpZHRoOiBudW1iZXIsXG4gICAgcHVibGljIGhlaWdodDogbnVtYmVyLFxuICAgIHB1YmxpYyByZWxaID0gMVxuICApIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBnZXQgeCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmxlZnRcbiAgfVxuICBnZXQgeSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnRvcFxuICB9XG4gIGdldCB6KCk6IG51bWJlciB7XG4gICAgcmV0dXJuXG4gIH1cbiAgZ2V0IGxlZnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50LnggKyB0aGlzLnJlbFhcbiAgfVxuICBnZXQgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudC55ICsgdGhpcy5yZWxZXG4gIH1cbiAgZ2V0IHJpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmxlZnQgKyB0aGlzLndpZHRoXG4gIH1cbiAgZ2V0IGJvdHRvbSgpIHtcbiAgICByZXR1cm4gdGhpcy50b3AgKyB0aGlzLmhlaWdodFxuICB9XG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLmxlZnQgKyB0aGlzLndpZHRoIC8gMlxuICB9XG4gIGdldCBjZW50ZXJZKCkge1xuICAgIHJldHVybiB0aGlzLnRvcCArIHRoaXMuaGVpZ2h0IC8gMlxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBmaWxsKDI1NSlcbiAgICBzdHJva2UoMClcbiAgICBzdHJva2VXZWlnaHQoNSlcbiAgICByZWN0KHRoaXMubGVmdCwgdGhpcy50b3AsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLmhlaWdodCAvIDMpXG4gICAgc3VwZXIuZHJhdygpXG4gIH1cbn1cbiIsICJpbXBvcnQgQ2hlY2tQb2ludCBmcm9tIFwiLi4vZWxlbWVudHMvQ2hlY2twb2ludFwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRyYXdDaGVja3BvaW50KGNwOiBDaGVja1BvaW50KSB7XG4gIHN0cm9rZVdlaWdodCg1KVxuICBzdHJva2UoMClcbiAgaWYgKCFjcC5vYnRhaW5lZCkge1xuICAgIGZpbGwoMTAwLCAxMDAsIDI1NSlcbiAgICByZWN0KGNwLmxlZnQgKyAxMCwgY3AudG9wICsgNSwgY3Aud2lkdGggLSAxMCwgY3AuaGVpZ2h0IC8gMilcbiAgfSBlbHNlIHtcbiAgfVxuICBmaWxsKDEwMClcbiAgcmVjdChjcC5sZWZ0LCBjcC50b3AsIDEwLCBjcC5oZWlnaHQsIDUsIDUsIDAsIDApXG59XG4iLCAiaW1wb3J0IFBvbHlnb24gZnJvbSBcIi4uL3ByaW1hcnkvUG9seWdvblwiXG5pbXBvcnQgZHJhd0NoZWNrcG9pbnQgZnJvbSBcIi4uL2RyYXdpbmdzL2RyYXdDaGVja3BvaW50XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hlY2tQb2ludCBleHRlbmRzIFBvbHlnb24ge1xuICBwdWJsaWMgb2J0YWluZWQgPSBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgc3VwZXIoeCArIDMwLCB5IC0gNjAsIDYwLCA2MClcbiAgfVxuXG4gIGZyYW1lKCkge1xuICAgIGlmICghdGhpcy5vYnRhaW5lZCAmJiB0aGlzLnRvdWNoKHRoaXMucGFyZW50LnBhcnR5LnBsYXllcikpIHtcbiAgICAgIHRoaXMub2J0YWluZWQgPSB0cnVlXG4gICAgICB0aGlzLnBhcmVudC5hZGRTcGF3bih0aGlzKVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMub2J0YWluZWQgPSBmYWxzZVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBkcmF3Q2hlY2twb2ludCh0aGlzKVxuICB9XG59XG4iLCAiaW1wb3J0IFBvbHlnb24gZnJvbSBcIi4uL3ByaW1hcnkvUG9seWdvblwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXRmb3JtIGV4dGVuZHMgUG9seWdvbiB7XG4gIGNvbnN0cnVjdG9yKHJlbFg6IG51bWJlciwgcmVsWTogbnVtYmVyLCB3aWR0aCA9IDIwMCwgaGVpZ2h0ID0gMTAsIHJlbFogPSAxKSB7XG4gICAgc3VwZXIocmVsWCwgcmVsWSwgd2lkdGgsIGhlaWdodCwgcmVsWilcbiAgfVxufVxuIiwgImltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4vUmVjdGFuZ2xlXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGl0Qm94IGV4dGVuZHMgUmVjdGFuZ2xlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHg6IG51bWJlcixcbiAgICBwdWJsaWMgeTogbnVtYmVyLFxuICAgIHB1YmxpYyB6OiBudW1iZXIsXG4gICAgLi4uY2hpbGRyZW46IFJlY3RhbmdsZVtdXG4gICkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmFkZENoaWxkcmVuKC4uLmNoaWxkcmVuKVxuICB9XG5cbiAgZ2V0IGxlZnQoKSB7XG4gICAgcmV0dXJuIE1hdGgubWluKC4uLnRoaXMuY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4gY2hpbGQubGVmdCkpXG4gIH1cbiAgZ2V0IHRvcCgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4oLi4udGhpcy5jaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiBjaGlsZC50b3ApKVxuICB9XG4gIGdldCByaWdodCgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoLi4udGhpcy5jaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiBjaGlsZC5yaWdodCkpXG4gIH1cbiAgZ2V0IGJvdHRvbSgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoLi4udGhpcy5jaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiBjaGlsZC5ib3R0b20pKVxuICB9XG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5yaWdodCAtIHRoaXMubGVmdFxuICB9XG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYm90dG9tIC0gdGhpcy50b3BcbiAgfVxuICBnZXQgY2VudGVyWCgpIHtcbiAgICByZXR1cm4gdGhpcy5sZWZ0ICsgdGhpcy53aWR0aCAvIDJcbiAgfVxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy50b3AgKyB0aGlzLmhlaWdodCAvIDJcbiAgfVxufVxuIiwgImltcG9ydCBIaXRCb3ggZnJvbSBcIi4uL3ByaW1hcnkvSGl0Qm94XCJcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuLi9wcmltYXJ5L1BvbHlnb25cIlxuaW1wb3J0IFBhcnR5IGZyb20gXCIuLi9QYXJ0eVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnNvciBleHRlbmRzIEhpdEJveCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXJ0eTogUGFydHkpIHtcbiAgICBzdXBlcigwLCAwLCAyMCwgbmV3IFBvbHlnb24oMCwgMCwgMTUsIDE1KSlcbiAgfVxuXG4gIGZyYW1lKCkge1xuICAgIHRoaXMueCA9IG1vdXNlWFxuICAgIHRoaXMueSA9IG1vdXNlWVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBzdHJva2VXZWlnaHQoNSlcbiAgICBmaWxsKDI1NSlcbiAgICBzdHJva2UoMClcbiAgICByZWN0KFxuICAgICAgdGhpcy54LFxuICAgICAgdGhpcy55LFxuICAgICAgdGhpcy53aWR0aCxcbiAgICAgIHRoaXMuaGVpZ2h0LFxuICAgICAgMCxcbiAgICAgIHRoaXMud2lkdGggLyAyLFxuICAgICAgdGhpcy53aWR0aCAvIDIsXG4gICAgICB0aGlzLndpZHRoIC8gMlxuICAgIClcbiAgICBpZiAodGhpcy5kZWJ1Z01vZGUpIHRoaXMuZGVidWcoKVxuICB9XG5cbiAgZGVidWcoKSB7XG4gICAgLy8gVE9ETzogYWZmaWNoZXIgWCBldCBZIGR1IHBvaW50IHBvaW50XHUwMEU5XG4gIH1cbn1cbiIsICJpbXBvcnQgUG9seWdvbiBmcm9tIFwiLi4vcHJpbWFyeS9Qb2x5Z29uXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbCBleHRlbmRzIFBvbHlnb24ge31cbiIsICJpbXBvcnQgSGl0Qm94IGZyb20gXCIuL0hpdEJveFwiXG5pbXBvcnQgUGFydHkgZnJvbSBcIi4uL1BhcnR5XCJcbmltcG9ydCBQbGF0Zm9ybSBmcm9tIFwiLi4vZWxlbWVudHMvUGxhdGZvcm1cIlxuaW1wb3J0IFJlY3RhbmdsZSBmcm9tIFwiLi9SZWN0YW5nbGVcIlxuaW1wb3J0IFdhbGwgZnJvbSBcIi4uL2VsZW1lbnRzL1dhbGxcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3ZlQm94IGV4dGVuZHMgSGl0Qm94IHtcbiAgcHVibGljIHBhcnR5OiBQYXJ0eVxuICBwdWJsaWMganVtcFByb2dyZXNzID0gZmFsc2VcbiAgcHVibGljIGp1bXBNYXhIZWlnaHQgPSAxNTBcbiAgcHVibGljIGp1bXBIZWlnaHQgPSAwXG4gIHB1YmxpYyBzcGVlZCA9IHsgeDogMTAsIHk6IDE1IH1cbiAgcHVibGljIHZlbG9jaXR5ID0geyB4OiAwLCB5OiAwIH1cblxuICBzZXQoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICB0aGlzLnggPSB4XG4gICAgdGhpcy55ID0geVxuICB9XG5cbiAgc2V0Qm90dG9tKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy54ID0geCArIHRoaXMud2lkdGggLyAyXG4gICAgdGhpcy55ID0geSAtIHRoaXMuaGVpZ2h0XG4gIH1cblxuICBhZGQoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICB0aGlzLnggKz0geFxuICAgIHRoaXMueSArPSB5XG4gIH1cblxuICBpbml0SnVtcCgpIHtcbiAgICBpZiAodGhpcy5vbkdyb3VuZCgpKSB7XG4gICAgICB0aGlzLnZlbG9jaXR5LnkgPSAtMVxuICAgICAgdGhpcy5qdW1wUHJvZ3Jlc3MgPSB0cnVlXG4gICAgICB0aGlzLmp1bXBIZWlnaHQgPSAwXG4gICAgfVxuICB9XG5cbiAgb25Hcm91bmQoKSB7XG4gICAgbGV0IGJvdHRvbSA9IC1JbmZpbml0eVxuICAgIGxldCBmb290czogUmVjdGFuZ2xlW10gPSBbXVxuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChib3R0b20gPCBjaGlsZC5ib3R0b20pIHtcbiAgICAgICAgYm90dG9tID0gY2hpbGQuYm90dG9tXG4gICAgICAgIGZvb3RzID0gW2NoaWxkXVxuICAgICAgfSBlbHNlIGlmIChib3R0b20gPT0gY2hpbGQuYm90dG9tKSB7XG4gICAgICAgIGZvb3RzLnB1c2goY2hpbGQpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy5wYXJ0eS5sZXZlbC5jaGlsZHJlblxuICAgICAgLmZpbHRlcigocG9seWdvbikgPT4ge1xuICAgICAgICByZXR1cm4gcG9seWdvbiBpbnN0YW5jZW9mIFBsYXRmb3JtIHx8IHBvbHlnb24gaW5zdGFuY2VvZiBXYWxsXG4gICAgICB9KVxuICAgICAgLnNvbWUoKHBvbHlnb24pID0+IHtcbiAgICAgICAgcmV0dXJuIGZvb3RzLnNvbWUoKGphbWJlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGphbWJlLmJvdHRvbSA+IHBvbHlnb24udG9wICYmXG4gICAgICAgICAgICBqYW1iZS50b3AgPCBwb2x5Z29uLnRvcCAmJlxuICAgICAgICAgICAgamFtYmUucmlnaHQgPiBwb2x5Z29uLmxlZnQgJiZcbiAgICAgICAgICAgIGphbWJlLmxlZnQgPCBwb2x5Z29uLnJpZ2h0XG4gICAgICAgICAgKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgfVxuXG4gIGZhbGwoKSB7XG4gICAgdGhpcy52ZWxvY2l0eS55ICs9IDAuMVxuICB9XG59XG4iLCAiaW1wb3J0IFRyYXAgZnJvbSBcIi4uL2VsZW1lbnRzL1RyYXBcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkcmF3VHJhcCh0cmFwOiBUcmFwKSB7XG4gIGZpbGwoMjU1LCAwLCAwKVxuICBzdHJva2UoMjU1LCA5OCwgMClcbiAgc3Ryb2tlV2VpZ2h0KHJhbmRvbSgxLCB0cmFwLmhlaWdodCAvIDEwKSlcbiAgcmVjdCh0cmFwLmxlZnQsIHRyYXAudG9wLCB0cmFwLndpZHRoLCB0cmFwLmhlaWdodCwgdHJhcC5oZWlnaHQgLyAzKVxuICBzdHJva2UoMjU1LCAyMTcsIDApXG4gIHN0cm9rZVdlaWdodChyYW5kb20oMSwgdHJhcC5oZWlnaHQgLyAyMCkpXG4gIHJlY3QodHJhcC5sZWZ0LCB0cmFwLnRvcCwgdHJhcC53aWR0aCwgdHJhcC5oZWlnaHQsIHRyYXAuaGVpZ2h0IC8gMylcbiAgbm9TdHJva2UoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8ICh0cmFwLmhlaWdodCArIHRyYXAud2lkdGgpIC8gMTAwOyBpKyspIHtcbiAgICBsZXQgc2l6ZSA9IHJhbmRvbSg1LCAxNSlcbiAgICBmaWxsKDI1NSwgMTAwLCAzMClcbiAgICByZWN0KFxuICAgICAgcmFuZG9tKHRyYXAubGVmdCwgdHJhcC5yaWdodCksXG4gICAgICByYW5kb20odHJhcC50b3AsIHRyYXAuYm90dG9tKSxcbiAgICAgIHNpemUsXG4gICAgICBzaXplXG4gICAgKVxuICAgIHNpemUgPSByYW5kb20oNSwgMTUpXG4gICAgZmlsbCgxMClcbiAgICByZWN0KFxuICAgICAgcmFuZG9tKHRyYXAubGVmdCwgdHJhcC5yaWdodCksXG4gICAgICByYW5kb20odHJhcC50b3AsIHRyYXAuYm90dG9tKSxcbiAgICAgIHNpemUsXG4gICAgICBzaXplXG4gICAgKVxuICB9XG59XG4iLCAiaW1wb3J0IFBvbHlnb24gZnJvbSBcIi4uL3ByaW1hcnkvUG9seWdvblwiXG5pbXBvcnQgZHJhd1RyYXAgZnJvbSBcIi4uL2RyYXdpbmdzL2RyYXdUcmFwXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhcCBleHRlbmRzIFBvbHlnb24ge1xuICBkcmF3KCkge1xuICAgIGRyYXdUcmFwKHRoaXMpXG4gIH1cbn1cbiIsICJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi9lbGVtZW50cy9QbGF5ZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkcmF3UGxheWVyKHBsYXllcjogUGxheWVyKSB7XG4gIGNvbnN0IFtcbiAgICB0ZXRlLFxuICAgIGJyYXNHYXVjaGUsXG4gICAgYnJhc0Ryb2l0LFxuICAgIHRvcnNlLFxuICAgIGphbWJlR2F1Y2hlLFxuICAgIGphbWJlRHJvaXRlLFxuICBdID0gcGxheWVyLmNoaWxkcmVuXG5cbiAgLy8gdGV0ZVxuICBsZXQgY2VudGVyWCA9IHRldGUuY2VudGVyWCArIHBsYXllci52ZWxvY2l0eS54ICogOCxcbiAgICB0b3AgPSB0ZXRlLnRvcCxcbiAgICBib3R0b20gPSB0ZXRlLmJvdHRvbVxuXG4gIGlmIChwbGF5ZXIucGFydHkua2V5c1tcIjM4XCJdKSB7XG4gICAgdG9wIC09IDVcbiAgICBib3R0b20gLT0gNVxuICB9XG4gIGlmIChwbGF5ZXIucGFydHkua2V5c1tcIjQwXCJdKSB7XG4gICAgdG9wICs9IDVcbiAgICBib3R0b20gKz0gNVxuICB9XG4gIHN0cm9rZVdlaWdodCg1KVxuICBzdHJva2UoMClcbiAgZmlsbCgyNTUpXG4gIHJlY3QodGV0ZS5sZWZ0LCB0ZXRlLnRvcCwgdGV0ZS53aWR0aCwgdGV0ZS5oZWlnaHQsIHRldGUud2lkdGggLyA1KVxuXG4gIGNvbnN0IGxpZmVzID0gcGxheWVyLnZpdGFsaXR5XG5cbiAgLy8geWV1eFxuICBub0ZpbGwoKVxuICBpZiAobGlmZXMgPT0gMCkge1xuICAgIGxpbmUoY2VudGVyWCAtIDE1LCB0b3AgKyAxNSwgY2VudGVyWCAtIDUsIHRvcCArIDMwKVxuICAgIGxpbmUoY2VudGVyWCAtIDUsIHRvcCArIDE1LCBjZW50ZXJYIC0gMTUsIHRvcCArIDMwKVxuICAgIGxpbmUoY2VudGVyWCArIDE1LCB0b3AgKyAxNSwgY2VudGVyWCArIDUsIHRvcCArIDMwKVxuICAgIGxpbmUoY2VudGVyWCArIDUsIHRvcCArIDE1LCBjZW50ZXJYICsgMTUsIHRvcCArIDMwKVxuICB9IGVsc2Uge1xuICAgIGxpbmUoY2VudGVyWCAtIDEwLCB0b3AgKyAxNSwgY2VudGVyWCAtIDEwLCB0b3AgKyAzMClcbiAgICBsaW5lKGNlbnRlclggKyAxMCwgdG9wICsgMTUsIGNlbnRlclggKyAxMCwgdG9wICsgMzApXG4gIH1cblxuICAvLyBib3VjaGVcbiAgaWYgKGxpZmVzID49IDMpIHtcbiAgICBiZXppZXIoXG4gICAgICBjZW50ZXJYIC0gMTAsXG4gICAgICBib3R0b20gLSAxNSxcbiAgICAgIGNlbnRlclggLSA1LFxuICAgICAgYm90dG9tIC0gMTAsXG4gICAgICBjZW50ZXJYICsgNSxcbiAgICAgIGJvdHRvbSAtIDEwLFxuICAgICAgY2VudGVyWCArIDEwLFxuICAgICAgYm90dG9tIC0gMTVcbiAgICApXG4gIH0gZWxzZSBpZiAobGlmZXMgPT0gMikge1xuICAgIGxpbmUoY2VudGVyWCAtIDgsIGJvdHRvbSAtIDE1LCBjZW50ZXJYICsgOCwgYm90dG9tIC0gMTUpXG4gIH0gZWxzZSBpZiAobGlmZXMgPT0gMSkge1xuICAgIGJlemllcihcbiAgICAgIGNlbnRlclggLSAxMCxcbiAgICAgIGJvdHRvbSAtIDEwLFxuICAgICAgY2VudGVyWCAtIDUsXG4gICAgICBib3R0b20gLSAxNSxcbiAgICAgIGNlbnRlclggKyA1LFxuICAgICAgYm90dG9tIC0gMTUsXG4gICAgICBjZW50ZXJYICsgMTAsXG4gICAgICBib3R0b20gLSAxMFxuICAgIClcbiAgfSBlbHNlIHtcbiAgICBiZXppZXIoXG4gICAgICBjZW50ZXJYIC0gMTAsXG4gICAgICBib3R0b20gLSAxMCxcbiAgICAgIGNlbnRlclggLSA1LFxuICAgICAgYm90dG9tIC0gMjAsXG4gICAgICBjZW50ZXJYICsgNSxcbiAgICAgIGJvdHRvbSAtIDIwLFxuICAgICAgY2VudGVyWCArIDEwLFxuICAgICAgYm90dG9tIC0gMTBcbiAgICApXG4gICAgbGluZShjZW50ZXJYIC0gMTAsIGJvdHRvbSAtIDEwLCBjZW50ZXJYICsgMTAsIGJvdHRvbSAtIDEwKVxuICB9XG5cbiAgLy8gYnJhcyBnYXVjaGVcbiAgZmlsbCgyNTUpXG4gIGFuZ2xlTW9kZShSQURJQU5TKVxuICBwdXNoKClcbiAgdHJhbnNsYXRlKGJyYXNHYXVjaGUuY2VudGVyWCwgYnJhc0dhdWNoZS50b3AgKyA1KVxuICByb3RhdGUoTWF0aC5tYXgocGxheWVyLnZlbG9jaXR5LnggLyAzLCAwKSlcbiAgdHJhbnNsYXRlKC1icmFzR2F1Y2hlLmNlbnRlclgsIC0oYnJhc0dhdWNoZS50b3AgKyA1KSlcbiAgcmVjdChcbiAgICBicmFzR2F1Y2hlLmxlZnQsXG4gICAgYnJhc0dhdWNoZS50b3AsXG4gICAgYnJhc0dhdWNoZS53aWR0aCxcbiAgICBicmFzR2F1Y2hlLmhlaWdodCxcbiAgICBicmFzR2F1Y2hlLndpZHRoIC8gMixcbiAgICAwLFxuICAgIDAsXG4gICAgYnJhc0dhdWNoZS53aWR0aCAvIDJcbiAgKVxuICBwb3AoKVxuXG4gIC8vIGJyYXMgZHJvaXRcbiAgcHVzaCgpXG4gIHRyYW5zbGF0ZShicmFzRHJvaXQuY2VudGVyWCwgYnJhc0Ryb2l0LnRvcCArIDUpXG4gIHJvdGF0ZShNYXRoLm1pbihwbGF5ZXIudmVsb2NpdHkueCAvIDMsIDApKVxuICB0cmFuc2xhdGUoLWJyYXNEcm9pdC5jZW50ZXJYLCAtKGJyYXNEcm9pdC50b3AgKyA1KSlcbiAgcmVjdChcbiAgICBicmFzRHJvaXQubGVmdCxcbiAgICBicmFzRHJvaXQudG9wLFxuICAgIGJyYXNEcm9pdC53aWR0aCxcbiAgICBicmFzRHJvaXQuaGVpZ2h0LFxuICAgIDAsXG4gICAgYnJhc0dhdWNoZS53aWR0aCAvIDIsXG4gICAgYnJhc0dhdWNoZS53aWR0aCAvIDIsXG4gICAgMFxuICApXG4gIHBvcCgpXG5cbiAgLy8gdG9yc2VcbiAgcmVjdChcbiAgICB0b3JzZS5sZWZ0LFxuICAgIHRvcnNlLnRvcCxcbiAgICB0b3JzZS53aWR0aCxcbiAgICB0b3JzZS5oZWlnaHQsXG4gICAgMCxcbiAgICAwLFxuICAgIHRvcnNlLndpZHRoIC8gNCxcbiAgICB0b3JzZS53aWR0aCAvIDRcbiAgKVxuXG4gIC8vIGphbWJlIGdhdWNoZVxuICBwdXNoKClcbiAgdHJhbnNsYXRlKGphbWJlR2F1Y2hlLmNlbnRlclgsIGphbWJlR2F1Y2hlLnRvcCArIDUpXG4gIHJvdGF0ZShcbiAgICBNYXRoLm1heChcbiAgICAgIG1hcChwbGF5ZXIuanVtcEhlaWdodCwgMCwgcGxheWVyLmp1bXBNYXhIZWlnaHQsIDAsIDAuNSkgK1xuICAgICAgICBwbGF5ZXIudmVsb2NpdHkueCAvIDEwLFxuICAgICAgMFxuICAgIClcbiAgKVxuICB0cmFuc2xhdGUoLWphbWJlR2F1Y2hlLmNlbnRlclgsIC0oamFtYmVHYXVjaGUudG9wICsgNSkpXG4gIHJlY3QoXG4gICAgamFtYmVHYXVjaGUubGVmdCxcbiAgICBqYW1iZUdhdWNoZS50b3AsXG4gICAgamFtYmVHYXVjaGUud2lkdGgsXG4gICAgamFtYmVHYXVjaGUuaGVpZ2h0LFxuICAgIGphbWJlR2F1Y2hlLndpZHRoIC8gMixcbiAgICBqYW1iZUdhdWNoZS53aWR0aCAvIDIsXG4gICAgMCxcbiAgICAwXG4gIClcbiAgcG9wKClcblxuICAvLyBqYW1iZSBkcm9pdGVcbiAgcHVzaCgpXG4gIHRyYW5zbGF0ZShqYW1iZURyb2l0ZS5jZW50ZXJYLCBqYW1iZURyb2l0ZS50b3AgKyA1KVxuICByb3RhdGUoXG4gICAgTWF0aC5taW4oXG4gICAgICBtYXAocGxheWVyLmp1bXBIZWlnaHQsIDAsIHBsYXllci5qdW1wTWF4SGVpZ2h0LCAwLCAtMC41KSArXG4gICAgICAgIHBsYXllci52ZWxvY2l0eS54IC8gMTAsXG4gICAgICAwXG4gICAgKVxuICApXG4gIHRyYW5zbGF0ZSgtamFtYmVEcm9pdGUuY2VudGVyWCwgLShqYW1iZURyb2l0ZS50b3AgKyA1KSlcbiAgcmVjdChcbiAgICBqYW1iZURyb2l0ZS5sZWZ0LFxuICAgIGphbWJlRHJvaXRlLnRvcCxcbiAgICBqYW1iZURyb2l0ZS53aWR0aCxcbiAgICBqYW1iZURyb2l0ZS5oZWlnaHQsXG4gICAgamFtYmVEcm9pdGUud2lkdGggLyAyLFxuICAgIGphbWJlRHJvaXRlLndpZHRoIC8gMixcbiAgICAwLFxuICAgIDBcbiAgKVxuICBwb3AoKVxufVxuIiwgImltcG9ydCBNb3ZlQm94IGZyb20gXCIuLi9wcmltYXJ5L01vdmVCb3hcIlxuaW1wb3J0IFBhcnR5IGZyb20gXCIuLi9QYXJ0eVwiXG5pbXBvcnQgUG9seWdvbiBmcm9tIFwiLi4vcHJpbWFyeS9Qb2x5Z29uXCJcbmltcG9ydCBUcmFwIGZyb20gXCIuL1RyYXBcIlxuaW1wb3J0IGRyYXdQbGF5ZXIgZnJvbSBcIi4uL2RyYXdpbmdzL2RyYXdQbGF5ZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBNb3ZlQm94IHtcbiAgcHVibGljIHZpdGFsaXR5ID0gM1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXJ0eTogUGFydHkpIHtcbiAgICBzdXBlcihcbiAgICAgIHBhcnR5LmxldmVsLnNwYXduc1swXS54LFxuICAgICAgcGFydHkubGV2ZWwuc3Bhd25zWzBdLnksXG4gICAgICAyLFxuICAgICAgbmV3IFBvbHlnb24oLTMwLCAtMTIwLCA2MCwgNjAsIDQpLCAvLyB0XHUwMEVBdGVcbiAgICAgIG5ldyBQb2x5Z29uKC0zMCwgLTYwLCAxNSwgMzAsIDEpLCAvLyBicmFzIGdhdWNoZVxuICAgICAgbmV3IFBvbHlnb24oMTUsIC02MCwgMTUsIDMwLCAxKSwgLy8gYnJhcyBkcm9pdFxuICAgICAgbmV3IFBvbHlnb24oLTE1LCAtNjAsIDMwLCAzMCwgMyksIC8vIHRvcnNlXG4gICAgICBuZXcgUG9seWdvbigtMTUsIC0zMCwgMTUsIDMwLCAyKSwgLy8gamFtYmUgZ2F1Y2hlXG4gICAgICBuZXcgUG9seWdvbigwLCAtMzAsIDE1LCAzMCwgMikgLy8gamFtYmUgZHJvaXRlXG4gICAgKVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52aXRhbGl0eSA9IDNcbiAgICB0aGlzLnBhcnR5LnJlc3Bhd24oKVxuICB9XG5cbiAgZnJhbWUoKSB7XG4gICAgLy8gY3JvcCB2ZWxvY2l0eVxuICAgIGlmICh0aGlzLnZlbG9jaXR5LnkgPiAxKSB0aGlzLnZlbG9jaXR5LnkgPSAxXG4gICAgaWYgKHRoaXMudmVsb2NpdHkueSA8IC0xKSB0aGlzLnZlbG9jaXR5LnkgPSAtMVxuICAgIGlmICh0aGlzLnZlbG9jaXR5LnggPiAxKSB0aGlzLnZlbG9jaXR5LnggPSAxXG4gICAgaWYgKHRoaXMudmVsb2NpdHkueCA8IC0xKSB0aGlzLnZlbG9jaXR5LnggPSAtMVxuICAgIGlmICh0aGlzLnZlbG9jaXR5LnggPiAtMC4xICYmIHRoaXMudmVsb2NpdHkueCA8IDAuMSkge1xuICAgICAgdGhpcy52ZWxvY2l0eS54ID0gMFxuICAgIH1cblxuICAgIC8vIGFwcGx5IG1vdmUgWCxZXG4gICAgdGhpcy54ICs9IHRoaXMuc3BlZWQueCAqIHRoaXMudmVsb2NpdHkueFxuICAgIHRoaXMueSArPSB0aGlzLnNwZWVkLnkgKiB0aGlzLnZlbG9jaXR5LnlcblxuICAgIC8vIGp1bXAgZmxvd1xuICAgIGlmIChcbiAgICAgIHRoaXMucGFydHkua2V5c1tcIjMyXCJdICYmXG4gICAgICB0aGlzLmp1bXBQcm9ncmVzcyAmJlxuICAgICAgdGhpcy5qdW1wSGVpZ2h0IDwgdGhpcy5qdW1wTWF4SGVpZ2h0XG4gICAgKSB7XG4gICAgICB0aGlzLnZlbG9jaXR5LnkgLT0gMC4xXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuanVtcFByb2dyZXNzID0gZmFsc2VcbiAgICB9XG4gICAgdGhpcy5qdW1wSGVpZ2h0ICs9IHRoaXMuc3BlZWQueSAqIHRoaXMudmVsb2NpdHkueSAqIC0xXG5cbiAgICAvLyBmYWxsIGZsb3dcbiAgICBpZiAodGhpcy5vbkdyb3VuZCgpICYmIHRoaXMudmVsb2NpdHkueSA+PSAwKSB7XG4gICAgICB0aGlzLnZlbG9jaXR5LnkgPSAwXG4gICAgICB0aGlzLmp1bXBIZWlnaHQgPSAwXG4gICAgICB3aGlsZSAodGhpcy5vbkdyb3VuZCgpKSB7XG4gICAgICAgIHRoaXMueS0tXG4gICAgICB9XG4gICAgICB0aGlzLnkrK1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZhbGwoKVxuICAgIH1cblxuICAgIC8vIGhvcml6b250YWwgbW92ZSBmbG93XG4gICAgaWYgKCF0aGlzLnBhcnR5LmtleXNbXCIzN1wiXSA9PSAhdGhpcy5wYXJ0eS5rZXlzW1wiMzlcIl0pIHtcbiAgICAgIHRoaXMudmVsb2NpdHkueCAqPSAwLjVcbiAgICB9XG4gICAgaWYgKHRoaXMucGFydHkua2V5c1tcIjM3XCJdKSB7XG4gICAgICB0aGlzLnZlbG9jaXR5LnggLT0gMC4yXG4gICAgfVxuICAgIGlmICh0aGlzLnBhcnR5LmtleXNbXCIzOVwiXSkge1xuICAgICAgdGhpcy52ZWxvY2l0eS54ICs9IDAuMlxuICAgIH1cblxuICAgIC8vIGRlYWRseSBmYWxsXG4gICAgaWYgKFxuICAgICAgdGhpcy50b3VjaChcbiAgICAgICAgLi4udGhpcy5wYXJ0eS5sZXZlbC5jaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiBjaGlsZCBpbnN0YW5jZW9mIFRyYXApXG4gICAgICApXG4gICAgKSB7XG4gICAgICB0aGlzLnZpdGFsaXR5LS1cbiAgICAgIHRoaXMucGFydHkucmVzcGF3bigpXG4gICAgICBpZiAodGhpcy52aXRhbGl0eSA8IDApIHtcbiAgICAgICAgdGhpcy5wYXJ0eS5yZXNldCgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZHJhdygpIHtcbiAgICBkcmF3UGxheWVyKHRoaXMpXG4gIH1cbn1cbiIsICJpbXBvcnQgTW92ZUJveCBmcm9tIFwiLi4vcHJpbWFyeS9Nb3ZlQm94XCJcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuLi9wcmltYXJ5L1BvbHlnb25cIlxuaW1wb3J0IFBhcnR5IGZyb20gXCIuLi9QYXJ0eVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuZW15IGV4dGVuZHMgTW92ZUJveCB7XG4gIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCBwdWJsaWMgcGFydHk6IFBhcnR5LCBwdWJsaWMgcGF0dGVybjogYW55KSB7XG4gICAgc3VwZXIoXG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIDAsXG4gICAgICBuZXcgUG9seWdvbigtNjAsIC05MCwgMTIwLCA2MCwgMSksIC8vIHRldGVcbiAgICAgIG5ldyBQb2x5Z29uKC00NSwgLTMwLCAzMCwgMzAsIDEpXG4gICAgKVxuICB9XG59XG4iLCAiaW1wb3J0IEhpdEJveCBmcm9tIFwiLi4vcHJpbWFyeS9IaXRCb3hcIlxuaW1wb3J0IFZlY3RvciBmcm9tIFwiLi4vdHlwZXMvVmVjdG9yXCJcbmltcG9ydCBQYXJ0eSBmcm9tIFwiLi4vUGFydHlcIlxuaW1wb3J0IEVuZW15IGZyb20gXCIuL0VuZW15XCJcbmltcG9ydCBQb2x5Z29uIGZyb20gXCIuLi9wcmltYXJ5L1BvbHlnb25cIlxuaW1wb3J0IExldmVsT3B0aW9ucyBmcm9tIFwiLi4vdHlwZXMvTGV2ZWxPcHRpb25zXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV2ZWwgZXh0ZW5kcyBIaXRCb3gge1xuICBwdWJsaWMgcGFydHk6IFBhcnR5XG4gIHB1YmxpYyBuYW1lOiBzdHJpbmdcbiAgcHVibGljIHNwYXduczogVmVjdG9yW11cbiAgcHVibGljIGVuZW1pZXM6IEVuZW15W11cblxuICBjb25zdHJ1Y3RvcihwYXJ0eTogUGFydHksIG9wdGlvbnM6IExldmVsT3B0aW9ucykge1xuICAgIHN1cGVyKDAsIDAsIDEsIC4uLm9wdGlvbnMucG9seWdvbnMpXG4gICAgdGhpcy5wYXJ0eSA9IHBhcnR5XG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lXG4gICAgdGhpcy5lbmVtaWVzID0gb3B0aW9ucy5lbmVtaWVzXG4gICAgdGhpcy5zcGF3bnMgPSBbb3B0aW9ucy5zcGF3bl1cbiAgfVxuXG4gIGFkZFNwYXduKHBvbHlnb246IFBvbHlnb24pIHtcbiAgICB0aGlzLnNwYXducy51bnNoaWZ0KHtcbiAgICAgIHg6IHBvbHlnb24ucmVsWCArIDMwLFxuICAgICAgeTogcG9seWdvbi5yZWxZICsgNjAsXG4gICAgfSlcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMueCA9IDBcbiAgICB0aGlzLnkgPSAwXG4gICAgdGhpcy5zcGF3bnMgPSBbdGhpcy5zcGF3bnMucG9wKCldXG4gICAgc3VwZXIucmVzZXQoKVxuICB9XG59XG4iLCAiaW1wb3J0IENoZWNrUG9pbnQgZnJvbSBcIi4vZWxlbWVudHMvQ2hlY2tQb2ludFwiXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCIuL3ByaW1hcnkvUmVjdGFuZ2xlXCJcbmltcG9ydCBQbGF0Zm9ybSBmcm9tIFwiLi9lbGVtZW50cy9QbGF0Zm9ybVwiXG5pbXBvcnQgQ3Vyc29yIGZyb20gXCIuL2VsZW1lbnRzL0N1cnNvclwiXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL2VsZW1lbnRzL1BsYXllclwiXG5pbXBvcnQgRW5lbXkgZnJvbSBcIi4vZWxlbWVudHMvRW5lbXlcIlxuaW1wb3J0IExldmVsIGZyb20gXCIuL2VsZW1lbnRzL0xldmVsXCJcbmltcG9ydCBUcmFwIGZyb20gXCIuL2VsZW1lbnRzL1RyYXBcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0eSB7XG4gIHB1YmxpYyBrZXlzOiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9XG4gIHB1YmxpYyBwbGF5ZXI6IFBsYXllclxuICBwdWJsaWMgY3Vyc29yOiBDdXJzb3JcbiAgcHVibGljIGxldmVsczogTGV2ZWxbXVxuICBwdWJsaWMgbGV2ZWxJbmRleCA9IDBcbiAgcHVibGljIGRlYnVnTW9kZSA9IGZhbHNlXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5sZXZlbHMgPSBbXG4gICAgICBuZXcgTGV2ZWwodGhpcywge1xuICAgICAgICBzcGF3bjoge1xuICAgICAgICAgIHg6IDYwLFxuICAgICAgICAgIHk6IDEyMCxcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogXCJMZXZlbCAxXCIsXG4gICAgICAgIHBvbHlnb25zOiBbXG4gICAgICAgICAgbmV3IFBsYXRmb3JtKDAsIDEyMCksXG4gICAgICAgICAgbmV3IFBsYXRmb3JtKDQwMCwgNjApLFxuICAgICAgICAgIG5ldyBQbGF0Zm9ybSgwLCAtMTIwKSxcbiAgICAgICAgICBuZXcgUGxhdGZvcm0oLTQwMCwgLTE4MCksXG4gICAgICAgICAgbmV3IFBsYXRmb3JtKDAsIC00MDApLFxuICAgICAgICAgIG5ldyBQbGF0Zm9ybSg0MDAsIC0zNjApLFxuICAgICAgICAgIG5ldyBQbGF0Zm9ybSgwLCAtNjAwKSxcbiAgICAgICAgICBuZXcgUGxhdGZvcm0oLTQwMCwgLTUwMCksXG4gICAgICAgICAgbmV3IFRyYXAoLTMwMDAsIDIwMCwgNjAwMCwgNTAwKSxcbiAgICAgICAgICBuZXcgQ2hlY2tQb2ludCg1MDAsIDYwKSxcbiAgICAgICAgICBuZXcgQ2hlY2tQb2ludCgtMzAwLCAtMTgwKSxcbiAgICAgICAgXSxcbiAgICAgICAgZW5lbWllczogW25ldyBFbmVteSgwLCAwLCB0aGlzLCBbXSksIG5ldyBFbmVteSgwLCAwLCB0aGlzLCBbXSldLFxuICAgICAgfSksXG4gICAgXVxuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcih0aGlzKVxuICAgIHRoaXMuY3Vyc29yID0gbmV3IEN1cnNvcih0aGlzKVxuICB9XG5cbiAgZ2V0IGVsZW1lbnRzKCk6IFJlY3RhbmdsZVtdIHtcbiAgICByZXR1cm4gW3RoaXMubGV2ZWwsIHRoaXMucGxheWVyLCB0aGlzLmN1cnNvcl0uc29ydCgoYSwgYikgPT4gYS56IC0gYi56KVxuICB9XG5cbiAgZ2V0IGxldmVsKCkge1xuICAgIHJldHVybiB0aGlzLmxldmVsc1t0aGlzLmxldmVsSW5kZXhdXG4gIH1cblxuICByZXNwYXduKCkge1xuICAgIHRoaXMubGV2ZWwueCA9IDBcbiAgICB0aGlzLmxldmVsLnkgPSAwXG4gICAgdGhpcy5wbGF5ZXIuc2V0KHRoaXMubGV2ZWwuc3Bhd25zWzBdLngsIHRoaXMubGV2ZWwuc3Bhd25zWzBdLnkpXG4gICAgdGhpcy5wbGF5ZXIudmVsb2NpdHkgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMCxcbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQucmVzZXQoKVxuICAgIH0pXG4gIH1cblxuICBmcmFtZSgpIHtcbiAgICBjb25zdCBkaXN0WCA9IHRoaXMucGxheWVyLnggLSB3aWR0aCAvIDIsXG4gICAgICBkaXN0WSA9IHRoaXMucGxheWVyLnkgLSBoZWlnaHQgLyAyXG4gICAgdGhpcy5lbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50LnggLT0gZGlzdFggLyAxMFxuICAgICAgZWxlbWVudC55IC09IGRpc3RZIC8gMTBcbiAgICAgIGVsZW1lbnQuZnJhbWUoKVxuICAgIH0pXG4gIH1cblxuICBkcmF3KCkge1xuICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5kcmF3KClcbiAgICB9KVxuICAgIGlmICh0aGlzLmRlYnVnTW9kZSkgdGhpcy5kZWJ1ZygpXG4gIH1cblxuICBkZWJ1ZygpIHtcbiAgICB0ZXh0U2l6ZSgyMClcbiAgICBmaWxsKDI1NSwgMCwgMjU1KVxuICAgIG5vU3Ryb2tlKClcbiAgICB0ZXh0KGAke3RoaXMubGV2ZWwubmFtZX1cXG4ke01hdGgucm91bmQoZnJhbWVSYXRlKCkpfSBGUFNgLCB3aWR0aCAvIDIsIDUwKVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7QUNFZSxxQkFBbUI7QUFDaEM7QUFDQSxpQkFBYTtBQUNiLFdBQU8sR0FBRyxHQUFHO0FBQ2IsU0FBSyxVQUFVLE1BQU0sVUFBVSxLQUFLLFVBQVUsT0FBTyxVQUFVO0FBQy9ELFNBQUssVUFBVSxNQUFNLFVBQVUsS0FBSyxVQUFVLE9BQU8sVUFBVTtBQUMvRCxTQUFLLFVBQVUsT0FBTyxVQUFVLEtBQUssVUFBVSxNQUFNLFVBQVU7QUFDL0Q7QUFDQSxTQUFLLEdBQUcsS0FBSztBQUNiLGNBQVUsT0FBTztBQUNqQixTQUNFLEdBQUcsVUFBVSxZQUFZO0FBQUEsSUFBVyxLQUFLLE1BQ3ZDLFVBQVUsVUFDSCxLQUFLLE1BQU0sVUFBVTtBQUFBLFFBQWUsS0FBSyxNQUNoRCxVQUFVLG1CQUNFLEtBQUssTUFBTSxVQUFVO0FBQUEsTUFBa0IsS0FBSyxNQUN4RCxVQUFVLGVBQ0EsS0FBSyxNQUFNLFVBQVUsU0FDakMsS0FBSyxNQUFNLFVBQVUsVUFDckIsS0FBSyxNQUFNLFVBQVU7QUFBQTs7O0FDckJ6QjtBQUFBO0FBR1Msc0JBQXdCO0FBQ3hCLHVCQUFZO0FBQUE7QUFBQSxJQWVuQjtBQUNFLGlCQUFXLFNBQVMsS0FBSztBQUFVLGNBQU07QUFBQTtBQUFBLElBRTNDO0FBQ0UsaUJBQVcsU0FBUyxLQUFLO0FBQVUsY0FBTTtBQUFBO0FBQUEsSUFFM0M7QUFDRSxpQkFBVyxTQUFTLEtBQUs7QUFBVSxjQUFNO0FBQUE7QUFBQSxJQUUzQztBQUNFLGdCQUFVO0FBQ1YsaUJBQVcsU0FBUyxLQUFLO0FBQVUsY0FBTTtBQUFBO0FBQUEsSUFHM0MsU0FBUztBQUNQLGFBQU8sV0FBVyxLQUFLLENBQUM7QUFDdEIsZUFBTyxVQUFVLE1BQU0sWUFBWTtBQUFBO0FBQUE7QUFBQSxJQUl2QyxlQUFlO0FBQ2IsaUJBQVcsU0FBUztBQUNsQixhQUFLLFNBQVM7QUFBQTtBQUFBO0FBQUEsSUFJbEIsU0FBUztBQUNQLFdBQUssU0FBUyxLQUFLO0FBQ25CLFlBQU0sU0FBUztBQUFBO0FBQUEsV0FHVixNQUFNLElBQWU7QUFDMUIsYUFDRSxHQUFHLE9BQU8sR0FBRyxTQUNiLEdBQUcsUUFBUSxHQUFHLFFBQ2QsR0FBRyxNQUFNLEdBQUcsVUFDWixHQUFHLFNBQVMsR0FBRztBQUFBO0FBQUE7QUF2RHJCLE1BRU8sb0JBRlA7OztBQ0FBLDhCQUVxQztBQUFBLElBSW5DLFlBQ1MsTUFDQSxNQUNBLFFBQ0EsU0FDQSxPQUFPO0FBRWQ7QUFOTztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEYsdUJBQVk7QUFBQTtBQUFBLFFBWWY7QUFDRixhQUFPLEtBQUs7QUFBQTtBQUFBLFFBRVY7QUFDRixhQUFPLEtBQUs7QUFBQTtBQUFBLFFBRVY7QUFDRjtBQUFBO0FBQUEsUUFFRTtBQUNGLGFBQU8sS0FBSyxPQUFPLElBQUksS0FBSztBQUFBO0FBQUEsUUFFMUI7QUFDRixhQUFPLEtBQUssT0FBTyxJQUFJLEtBQUs7QUFBQTtBQUFBLFFBRTFCO0FBQ0YsYUFBTyxLQUFLLE9BQU8sS0FBSztBQUFBO0FBQUEsUUFFdEI7QUFDRixhQUFPLEtBQUssTUFBTSxLQUFLO0FBQUE7QUFBQSxRQUVyQjtBQUNGLGFBQU8sS0FBSyxPQUFPLEtBQUssUUFBUTtBQUFBO0FBQUEsUUFFOUI7QUFDRixhQUFPLEtBQUssTUFBTSxLQUFLLFNBQVM7QUFBQTtBQUFBLElBR2xDO0FBQ0UsV0FBSztBQUNMLGFBQU87QUFDUCxtQkFBYTtBQUNiLFdBQUssS0FBSyxNQUFNLEtBQUssS0FBSyxLQUFLLE9BQU8sS0FBSyxRQUFRLEtBQUssU0FBUztBQUNqRSxZQUFNO0FBQUE7QUFBQTtBQWpEVixNQUVPLGtCQUZQOzs7QUNFZSwwQkFBd0I7QUFDckMsaUJBQWE7QUFDYixXQUFPO0FBQ1AsUUFBSSxDQUFDLEdBQUc7QUFDTixXQUFLLEtBQUssS0FBSztBQUNmLFdBQUssR0FBRyxPQUFPLElBQUksR0FBRyxNQUFNLEdBQUcsR0FBRyxRQUFRLElBQUksR0FBRyxTQUFTO0FBQUE7QUFBQTtBQUc1RCxTQUFLO0FBQ0wsU0FBSyxHQUFHLE1BQU0sR0FBRyxLQUFLLElBQUksR0FBRyxRQUFRLEdBQUcsR0FBRyxHQUFHO0FBQUE7OztBQ1hoRCxpQ0FHd0M7QUFBQSxJQUd0QyxZQUFZLEdBQVc7QUFDckIsWUFBTSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7QUFIckIsc0JBQVc7QUFBQTtBQUFBLElBTWxCO0FBQ0UsVUFBSSxDQUFDLEtBQUssWUFBWSxLQUFLLE1BQU0sS0FBSyxPQUFPLE1BQU07QUFDakQsYUFBSyxXQUFXO0FBQ2hCLGFBQUssT0FBTyxTQUFTO0FBQUE7QUFBQTtBQUFBLElBSXpCO0FBQ0UsV0FBSyxXQUFXO0FBQUE7QUFBQSxJQUdsQjtBQUNFLHFCQUFlO0FBQUE7QUFBQTtBQXRCbkIsTUFHTyxxQkFIUDs7O0FDQUEsK0JBRXNDO0FBQUEsSUFDcEMsWUFBWSxNQUFjLE1BQWMsU0FBUSxLQUFLLFVBQVMsSUFBSSxPQUFPO0FBQ3ZFLFlBQU0sTUFBTSxNQUFNLFFBQU8sU0FBUTtBQUFBO0FBQUE7QUFKckMsTUFFTyxtQkFGUDs7O0FDQUEsNkJBRW9DO0FBQUEsSUFDbEMsWUFDUyxHQUNBLEdBQ0EsTUFDSjtBQUVIO0FBTE87QUFDQTtBQUNBO0FBSVAsV0FBSyxZQUFZLEdBQUc7QUFBQTtBQUFBLFFBR2xCO0FBQ0YsYUFBTyxLQUFLLElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxDQUFDLFVBQVUsTUFBTTtBQUFBO0FBQUEsUUFFcEQ7QUFDRixhQUFPLEtBQUssSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLENBQUMsVUFBVSxNQUFNO0FBQUE7QUFBQSxRQUVwRDtBQUNGLGFBQU8sS0FBSyxJQUFJLEdBQUcsS0FBSyxTQUFTLElBQUksQ0FBQyxVQUFVLE1BQU07QUFBQTtBQUFBLFFBRXBEO0FBQ0YsYUFBTyxLQUFLLElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxDQUFDLFVBQVUsTUFBTTtBQUFBO0FBQUEsUUFFcEQ7QUFDRixhQUFPLEtBQUssUUFBUSxLQUFLO0FBQUE7QUFBQSxRQUV2QjtBQUNGLGFBQU8sS0FBSyxTQUFTLEtBQUs7QUFBQTtBQUFBLFFBRXhCO0FBQ0YsYUFBTyxLQUFLLE9BQU8sS0FBSyxRQUFRO0FBQUE7QUFBQSxRQUU5QjtBQUNGLGFBQU8sS0FBSyxNQUFNLEtBQUssU0FBUztBQUFBO0FBQUE7QUFuQ3BDLE1BRU8saUJBRlA7OztBQ0FBLDZCQUlvQztBQUFBLElBQ2xDLFlBQW1CO0FBQ2pCLFlBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxnQkFBUSxHQUFHLEdBQUcsSUFBSTtBQURyQjtBQUFBO0FBQUEsSUFJbkI7QUFDRSxXQUFLLElBQUk7QUFDVCxXQUFLLElBQUk7QUFBQTtBQUFBLElBR1g7QUFDRSxtQkFBYTtBQUNiLFdBQUs7QUFDTCxhQUFPO0FBQ1AsV0FDRSxLQUFLLEdBQ0wsS0FBSyxHQUNMLEtBQUssT0FDTCxLQUFLLFFBQ0wsR0FDQSxLQUFLLFFBQVEsR0FDYixLQUFLLFFBQVEsR0FDYixLQUFLLFFBQVE7QUFFZixVQUFJLEtBQUs7QUFBVyxhQUFLO0FBQUE7QUFBQSxJQUczQjtBQUFBO0FBQUE7QUEvQkYsTUFJTyxpQkFKUDs7O0FDQUEsMkJBRWtDO0FBQUE7QUFGbEMsTUFFTyxlQUZQOzs7QUNBQSw4QkFNcUM7QUFBQSxJQU5yQztBQUFBO0FBUVMsMEJBQWU7QUFDZiwyQkFBZ0I7QUFDaEIsd0JBQWE7QUFDYixtQkFBUSxDQUFFLEdBQUcsSUFBSSxHQUFHO0FBQ3BCLHNCQUFXLENBQUUsR0FBRyxHQUFHLEdBQUc7QUFBQTtBQUFBLElBRTdCLElBQUksR0FBVztBQUNiLFdBQUssSUFBSTtBQUNULFdBQUssSUFBSTtBQUFBO0FBQUEsSUFHWCxVQUFVLEdBQVc7QUFDbkIsV0FBSyxJQUFJLElBQUksS0FBSyxRQUFRO0FBQzFCLFdBQUssSUFBSSxJQUFJLEtBQUs7QUFBQTtBQUFBLElBR3BCLElBQUksR0FBVztBQUNiLFdBQUssS0FBSztBQUNWLFdBQUssS0FBSztBQUFBO0FBQUEsSUFHWjtBQUNFLFVBQUksS0FBSztBQUNQLGFBQUssU0FBUyxJQUFJO0FBQ2xCLGFBQUssZUFBZTtBQUNwQixhQUFLLGFBQWE7QUFBQTtBQUFBO0FBQUEsSUFJdEI7QUFDRSxVQUFJLFNBQVM7QUFDYixVQUFJLFFBQXFCO0FBQ3pCLFdBQUssU0FBUyxRQUFRLENBQUM7QUFDckIsWUFBSSxTQUFTLE1BQU07QUFDakIsbUJBQVMsTUFBTTtBQUNmLGtCQUFRLENBQUM7QUFBQSxtQkFDQSxVQUFVLE1BQU07QUFDekIsZ0JBQU0sS0FBSztBQUFBO0FBQUE7QUFHZixhQUFPLEtBQUssTUFBTSxNQUFNLFNBQ3JCLE9BQU8sQ0FBQztBQUNQLGVBQU8sbUJBQW1CLG9CQUFZLG1CQUFtQjtBQUFBLFNBRTFELEtBQUssQ0FBQztBQUNMLGVBQU8sTUFBTSxLQUFLLENBQUM7QUFDakIsaUJBQ0UsTUFBTSxTQUFTLFFBQVEsT0FDdkIsTUFBTSxNQUFNLFFBQVEsT0FDcEIsTUFBTSxRQUFRLFFBQVEsUUFDdEIsTUFBTSxPQUFPLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU0vQjtBQUNFLFdBQUssU0FBUyxLQUFLO0FBQUE7QUFBQTtBQWpFdkIsTUFNTyxrQkFOUDs7O0FDRWUsb0JBQWtCO0FBQy9CLFNBQUssS0FBSyxHQUFHO0FBQ2IsV0FBTyxLQUFLLElBQUk7QUFDaEIsaUJBQWEsT0FBTyxHQUFHLEtBQUssU0FBUztBQUNyQyxTQUFLLEtBQUssTUFBTSxLQUFLLEtBQUssS0FBSyxPQUFPLEtBQUssUUFBUSxLQUFLLFNBQVM7QUFDakUsV0FBTyxLQUFLLEtBQUs7QUFDakIsaUJBQWEsT0FBTyxHQUFHLEtBQUssU0FBUztBQUNyQyxTQUFLLEtBQUssTUFBTSxLQUFLLEtBQUssS0FBSyxPQUFPLEtBQUssUUFBUSxLQUFLLFNBQVM7QUFDakU7QUFDQSxhQUFTLElBQUksR0FBRyxJQUFLLE1BQUssU0FBUyxLQUFLLFNBQVMsS0FBSztBQUNwRCxVQUFJLE9BQU8sT0FBTyxHQUFHO0FBQ3JCLFdBQUssS0FBSyxLQUFLO0FBQ2YsV0FDRSxPQUFPLEtBQUssTUFBTSxLQUFLLFFBQ3ZCLE9BQU8sS0FBSyxLQUFLLEtBQUssU0FDdEIsTUFDQTtBQUVGLGFBQU8sT0FBTyxHQUFHO0FBQ2pCLFdBQUs7QUFDTCxXQUNFLE9BQU8sS0FBSyxNQUFNLEtBQUssUUFDdkIsT0FBTyxLQUFLLEtBQUssS0FBSyxTQUN0QixNQUNBO0FBQUE7QUFBQTs7O0FDMUJOLDJCQUdrQztBQUFBLElBQ2hDO0FBQ0UsZUFBUztBQUFBO0FBQUE7QUFMYixNQUdPLGVBSFA7OztBQ0VlLHNCQUFvQjtBQUNqQyxVQUFNO0FBQUEsTUFDSjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsUUFDRSxPQUFPO0FBR1gsUUFBSSxVQUFVLEtBQUssVUFBVSxPQUFPLFNBQVMsSUFBSSxHQUMvQyxNQUFNLEtBQUssS0FDWCxTQUFTLEtBQUs7QUFFaEIsUUFBSSxPQUFPLE1BQU0sS0FBSztBQUNwQixhQUFPO0FBQ1AsZ0JBQVU7QUFBQTtBQUVaLFFBQUksT0FBTyxNQUFNLEtBQUs7QUFDcEIsYUFBTztBQUNQLGdCQUFVO0FBQUE7QUFFWixpQkFBYTtBQUNiLFdBQU87QUFDUCxTQUFLO0FBQ0wsU0FBSyxLQUFLLE1BQU0sS0FBSyxLQUFLLEtBQUssT0FBTyxLQUFLLFFBQVEsS0FBSyxRQUFRO0FBRWhFLFVBQU0sUUFBUSxPQUFPO0FBR3JCO0FBQ0EsUUFBSSxTQUFTO0FBQ1gsV0FBSyxVQUFVLElBQUksTUFBTSxJQUFJLFVBQVUsR0FBRyxNQUFNO0FBQ2hELFdBQUssVUFBVSxHQUFHLE1BQU0sSUFBSSxVQUFVLElBQUksTUFBTTtBQUNoRCxXQUFLLFVBQVUsSUFBSSxNQUFNLElBQUksVUFBVSxHQUFHLE1BQU07QUFDaEQsV0FBSyxVQUFVLEdBQUcsTUFBTSxJQUFJLFVBQVUsSUFBSSxNQUFNO0FBQUE7QUFFaEQsV0FBSyxVQUFVLElBQUksTUFBTSxJQUFJLFVBQVUsSUFBSSxNQUFNO0FBQ2pELFdBQUssVUFBVSxJQUFJLE1BQU0sSUFBSSxVQUFVLElBQUksTUFBTTtBQUFBO0FBSW5ELFFBQUksU0FBUztBQUNYLGFBQ0UsVUFBVSxJQUNWLFNBQVMsSUFDVCxVQUFVLEdBQ1YsU0FBUyxJQUNULFVBQVUsR0FDVixTQUFTLElBQ1QsVUFBVSxJQUNWLFNBQVM7QUFBQSxlQUVGLFNBQVM7QUFDbEIsV0FBSyxVQUFVLEdBQUcsU0FBUyxJQUFJLFVBQVUsR0FBRyxTQUFTO0FBQUEsZUFDNUMsU0FBUztBQUNsQixhQUNFLFVBQVUsSUFDVixTQUFTLElBQ1QsVUFBVSxHQUNWLFNBQVMsSUFDVCxVQUFVLEdBQ1YsU0FBUyxJQUNULFVBQVUsSUFDVixTQUFTO0FBQUE7QUFHWCxhQUNFLFVBQVUsSUFDVixTQUFTLElBQ1QsVUFBVSxHQUNWLFNBQVMsSUFDVCxVQUFVLEdBQ1YsU0FBUyxJQUNULFVBQVUsSUFDVixTQUFTO0FBRVgsV0FBSyxVQUFVLElBQUksU0FBUyxJQUFJLFVBQVUsSUFBSSxTQUFTO0FBQUE7QUFJekQsU0FBSztBQUNMLGNBQVU7QUFDVjtBQUNBLGNBQVUsV0FBVyxTQUFTLFdBQVcsTUFBTTtBQUMvQyxXQUFPLEtBQUssSUFBSSxPQUFPLFNBQVMsSUFBSSxHQUFHO0FBQ3ZDLGNBQVUsQ0FBQyxXQUFXLFNBQVMsQ0FBRSxZQUFXLE1BQU07QUFDbEQsU0FDRSxXQUFXLE1BQ1gsV0FBVyxLQUNYLFdBQVcsT0FDWCxXQUFXLFFBQ1gsV0FBVyxRQUFRLEdBQ25CLEdBQ0EsR0FDQSxXQUFXLFFBQVE7QUFFckI7QUFHQTtBQUNBLGNBQVUsVUFBVSxTQUFTLFVBQVUsTUFBTTtBQUM3QyxXQUFPLEtBQUssSUFBSSxPQUFPLFNBQVMsSUFBSSxHQUFHO0FBQ3ZDLGNBQVUsQ0FBQyxVQUFVLFNBQVMsQ0FBRSxXQUFVLE1BQU07QUFDaEQsU0FDRSxVQUFVLE1BQ1YsVUFBVSxLQUNWLFVBQVUsT0FDVixVQUFVLFFBQ1YsR0FDQSxXQUFXLFFBQVEsR0FDbkIsV0FBVyxRQUFRLEdBQ25CO0FBRUY7QUFHQSxTQUNFLE1BQU0sTUFDTixNQUFNLEtBQ04sTUFBTSxPQUNOLE1BQU0sUUFDTixHQUNBLEdBQ0EsTUFBTSxRQUFRLEdBQ2QsTUFBTSxRQUFRO0FBSWhCO0FBQ0EsY0FBVSxZQUFZLFNBQVMsWUFBWSxNQUFNO0FBQ2pELFdBQ0UsS0FBSyxJQUNILElBQUksT0FBTyxZQUFZLEdBQUcsT0FBTyxlQUFlLEdBQUcsT0FDakQsT0FBTyxTQUFTLElBQUksSUFDdEI7QUFHSixjQUFVLENBQUMsWUFBWSxTQUFTLENBQUUsYUFBWSxNQUFNO0FBQ3BELFNBQ0UsWUFBWSxNQUNaLFlBQVksS0FDWixZQUFZLE9BQ1osWUFBWSxRQUNaLFlBQVksUUFBUSxHQUNwQixZQUFZLFFBQVEsR0FDcEIsR0FDQTtBQUVGO0FBR0E7QUFDQSxjQUFVLFlBQVksU0FBUyxZQUFZLE1BQU07QUFDakQsV0FDRSxLQUFLLElBQ0gsSUFBSSxPQUFPLFlBQVksR0FBRyxPQUFPLGVBQWUsR0FBRyxRQUNqRCxPQUFPLFNBQVMsSUFBSSxJQUN0QjtBQUdKLGNBQVUsQ0FBQyxZQUFZLFNBQVMsQ0FBRSxhQUFZLE1BQU07QUFDcEQsU0FDRSxZQUFZLE1BQ1osWUFBWSxLQUNaLFlBQVksT0FDWixZQUFZLFFBQ1osWUFBWSxRQUFRLEdBQ3BCLFlBQVksUUFBUSxHQUNwQixHQUNBO0FBRUY7QUFBQTs7O0FDL0tGLDZCQU1vQztBQUFBLElBR2xDLFlBQW1CO0FBQ2pCLFlBQ0UsT0FBTSxNQUFNLE9BQU8sR0FBRyxHQUN0QixPQUFNLE1BQU0sT0FBTyxHQUFHLEdBQ3RCLEdBQ0EsSUFBSSxnQkFBUSxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQy9CLElBQUksZ0JBQVEsS0FBSyxLQUFLLElBQUksSUFBSSxJQUM5QixJQUFJLGdCQUFRLElBQUksS0FBSyxJQUFJLElBQUksSUFDN0IsSUFBSSxnQkFBUSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQzlCLElBQUksZ0JBQVEsS0FBSyxLQUFLLElBQUksSUFBSSxJQUM5QixJQUFJLGdCQUFRLEdBQUcsS0FBSyxJQUFJLElBQUk7QUFWYjtBQUZaLHNCQUFXO0FBQUE7QUFBQSxJQWdCbEI7QUFDRSxXQUFLLFdBQVc7QUFDaEIsV0FBSyxNQUFNO0FBQUE7QUFBQSxJQUdiO0FBRUUsVUFBSSxLQUFLLFNBQVMsSUFBSTtBQUFHLGFBQUssU0FBUyxJQUFJO0FBQzNDLFVBQUksS0FBSyxTQUFTLElBQUk7QUFBSSxhQUFLLFNBQVMsSUFBSTtBQUM1QyxVQUFJLEtBQUssU0FBUyxJQUFJO0FBQUcsYUFBSyxTQUFTLElBQUk7QUFDM0MsVUFBSSxLQUFLLFNBQVMsSUFBSTtBQUFJLGFBQUssU0FBUyxJQUFJO0FBQzVDLFVBQUksS0FBSyxTQUFTLElBQUksUUFBUSxLQUFLLFNBQVMsSUFBSTtBQUM5QyxhQUFLLFNBQVMsSUFBSTtBQUFBO0FBSXBCLFdBQUssS0FBSyxLQUFLLE1BQU0sSUFBSSxLQUFLLFNBQVM7QUFDdkMsV0FBSyxLQUFLLEtBQUssTUFBTSxJQUFJLEtBQUssU0FBUztBQUd2QyxVQUNFLEtBQUssTUFBTSxLQUFLLFNBQ2hCLEtBQUssZ0JBQ0wsS0FBSyxhQUFhLEtBQUs7QUFFdkIsYUFBSyxTQUFTLEtBQUs7QUFBQTtBQUVuQixhQUFLLGVBQWU7QUFBQTtBQUV0QixXQUFLLGNBQWMsS0FBSyxNQUFNLElBQUksS0FBSyxTQUFTLElBQUk7QUFHcEQsVUFBSSxLQUFLLGNBQWMsS0FBSyxTQUFTLEtBQUs7QUFDeEMsYUFBSyxTQUFTLElBQUk7QUFDbEIsYUFBSyxhQUFhO0FBQ2xCLGVBQU8sS0FBSztBQUNWLGVBQUs7QUFBQTtBQUVQLGFBQUs7QUFBQTtBQUVMLGFBQUs7QUFBQTtBQUlQLFVBQUksQ0FBQyxLQUFLLE1BQU0sS0FBSyxTQUFTLENBQUMsS0FBSyxNQUFNLEtBQUs7QUFDN0MsYUFBSyxTQUFTLEtBQUs7QUFBQTtBQUVyQixVQUFJLEtBQUssTUFBTSxLQUFLO0FBQ2xCLGFBQUssU0FBUyxLQUFLO0FBQUE7QUFFckIsVUFBSSxLQUFLLE1BQU0sS0FBSztBQUNsQixhQUFLLFNBQVMsS0FBSztBQUFBO0FBSXJCLFVBQ0UsS0FBSyxNQUNILEdBQUcsS0FBSyxNQUFNLE1BQU0sU0FBUyxPQUFPLENBQUMsVUFBVSxpQkFBaUI7QUFHbEUsYUFBSztBQUNMLGFBQUssTUFBTTtBQUNYLFlBQUksS0FBSyxXQUFXO0FBQ2xCLGVBQUssTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS2pCO0FBQ0UsaUJBQVc7QUFBQTtBQUFBO0FBNUZmLE1BTU8saUJBTlA7OztBQ0FBLDRCQUltQztBQUFBLElBQ2pDLFlBQVksR0FBVyxHQUFrQixRQUFxQjtBQUM1RCxZQUNFLEdBQ0EsR0FDQSxHQUNBLElBQUksZ0JBQVEsS0FBSyxLQUFLLEtBQUssSUFBSSxJQUMvQixJQUFJLGdCQUFRLEtBQUssS0FBSyxJQUFJLElBQUk7QUFOTztBQUFxQjtBQUFBO0FBQUE7QUFMaEUsTUFJTyxnQkFKUDs7O0FDQUEsNEJBT21DO0FBQUEsSUFNakMsWUFBWSxRQUFjO0FBQ3hCLFlBQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxRQUFRO0FBQzFCLFdBQUssUUFBUTtBQUNiLFdBQUssT0FBTyxRQUFRO0FBQ3BCLFdBQUssVUFBVSxRQUFRO0FBQ3ZCLFdBQUssU0FBUyxDQUFDLFFBQVE7QUFBQTtBQUFBLElBR3pCLFNBQVM7QUFDUCxXQUFLLE9BQU8sUUFBUTtBQUFBLFFBQ2xCLEdBQUcsUUFBUSxPQUFPO0FBQUEsUUFDbEIsR0FBRyxRQUFRLE9BQU87QUFBQTtBQUFBO0FBQUEsSUFJdEI7QUFDRSxXQUFLLElBQUk7QUFDVCxXQUFLLElBQUk7QUFDVCxXQUFLLFNBQVMsQ0FBQyxLQUFLLE9BQU87QUFDM0IsWUFBTTtBQUFBO0FBQUE7QUFoQ1YsTUFPTyxnQkFQUDs7O0FDQUE7QUFBQSxJQWlCRTtBQVBPLGtCQUFtQztBQUluQyx3QkFBYTtBQUNiLHVCQUFZO0FBR2pCLFdBQUssU0FBUztBQUFBLFFBQ1osSUFBSSxjQUFNLE1BQU07QUFBQSxVQUNkLE9BQU87QUFBQSxZQUNMLEdBQUc7QUFBQSxZQUNILEdBQUc7QUFBQTtBQUFBLFVBRUwsTUFBTTtBQUFBLFVBQ04sVUFBVTtBQUFBLFlBQ1IsSUFBSSxpQkFBUyxHQUFHO0FBQUEsWUFDaEIsSUFBSSxpQkFBUyxLQUFLO0FBQUEsWUFDbEIsSUFBSSxpQkFBUyxHQUFHO0FBQUEsWUFDaEIsSUFBSSxpQkFBUyxNQUFNO0FBQUEsWUFDbkIsSUFBSSxpQkFBUyxHQUFHO0FBQUEsWUFDaEIsSUFBSSxpQkFBUyxLQUFLO0FBQUEsWUFDbEIsSUFBSSxpQkFBUyxHQUFHO0FBQUEsWUFDaEIsSUFBSSxpQkFBUyxNQUFNO0FBQUEsWUFDbkIsSUFBSSxhQUFLLE1BQU8sS0FBSyxLQUFNO0FBQUEsWUFDM0IsSUFBSSxtQkFBVyxLQUFLO0FBQUEsWUFDcEIsSUFBSSxtQkFBVyxNQUFNO0FBQUE7QUFBQSxVQUV2QixTQUFTLENBQUMsSUFBSSxjQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUssSUFBSSxjQUFNLEdBQUcsR0FBRyxNQUFNO0FBQUE7QUFBQTtBQUcvRCxXQUFLLFNBQVMsSUFBSSxlQUFPO0FBQ3pCLFdBQUssU0FBUyxJQUFJLGVBQU87QUFBQTtBQUFBLFFBR3ZCO0FBQ0YsYUFBTyxDQUFDLEtBQUssT0FBTyxLQUFLLFFBQVEsS0FBSyxRQUFRLEtBQUssQ0FBQyxHQUFHLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFBQTtBQUFBLFFBR25FO0FBQ0YsYUFBTyxLQUFLLE9BQU8sS0FBSztBQUFBO0FBQUEsSUFHMUI7QUFDRSxXQUFLLE1BQU0sSUFBSTtBQUNmLFdBQUssTUFBTSxJQUFJO0FBQ2YsV0FBSyxPQUFPLElBQUksS0FBSyxNQUFNLE9BQU8sR0FBRyxHQUFHLEtBQUssTUFBTSxPQUFPLEdBQUc7QUFDN0QsV0FBSyxPQUFPLFdBQVc7QUFBQSxRQUNyQixHQUFHO0FBQUEsUUFDSCxHQUFHO0FBQUE7QUFBQTtBQUFBLElBSVA7QUFDRSxXQUFLLFNBQVMsUUFBUSxDQUFDO0FBQ3JCLGdCQUFRO0FBQUE7QUFBQTtBQUFBLElBSVo7QUFDRSxZQUFNLFFBQVEsS0FBSyxPQUFPLElBQUksUUFBUSxHQUNwQyxRQUFRLEtBQUssT0FBTyxJQUFJLFNBQVM7QUFDbkMsV0FBSyxTQUFTLFFBQVEsQ0FBQztBQUNyQixnQkFBUSxLQUFLLFFBQVE7QUFDckIsZ0JBQVEsS0FBSyxRQUFRO0FBQ3JCLGdCQUFRO0FBQUE7QUFBQTtBQUFBLElBSVo7QUFDRSxXQUFLLFNBQVMsUUFBUSxDQUFDO0FBQ3JCLGdCQUFRO0FBQUE7QUFFVixVQUFJLEtBQUs7QUFBVyxhQUFLO0FBQUE7QUFBQSxJQUczQjtBQUNFLGVBQVM7QUFDVCxXQUFLLEtBQUssR0FBRztBQUNiO0FBQ0EsV0FBSyxHQUFHLEtBQUssTUFBTTtBQUFBLEVBQVMsS0FBSyxNQUFNLG9CQUFvQixRQUFRLEdBQUc7QUFBQTtBQUFBO0FBMUYxRSxNQVNPLGdCQVRQOzs7QWpCTUEsV0FBUyxpQkFBaUIsZUFBZSxDQUFDLFVBQVUsTUFBTTtBQUUxRCxNQUFJO0FBRUc7QUFDTCxpQkFDRSxLQUFLLElBQUksU0FBUyxnQkFBZ0IsYUFBYSxPQUFPLGNBQWMsSUFDcEUsS0FBSyxJQUFJLFNBQVMsZ0JBQWdCLGNBQWMsT0FBTyxlQUFlO0FBRXhFLGNBQVU7QUFDVixZQUFRLElBQUk7QUFBQTtBQUdQO0FBQ0wsVUFBTTtBQUNOLGVBQVc7QUFDWCxVQUFNO0FBQUE7QUFHRDtBQUNMLFVBQU0sS0FBSyxPQUFPLFlBQVk7QUFDOUIsUUFBSSxXQUFXO0FBQ2IsWUFBTSxPQUFPO0FBQUE7QUFBQTtBQUdWO0FBQ0wsVUFBTSxLQUFLLE9BQU8sWUFBWTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
