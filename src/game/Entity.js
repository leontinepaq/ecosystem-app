import {sprites} from "../graphics/sprites"

export class Entity {
  constructor(x, y, type, color) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.radius = 10;
    this.dead = false;
    this.lastReproduction = Date.now();
    this.reproductionCooldown = 3000;
    this.speed = 1;
    this.energy = 100; // énergie initiale
    this.maxEnergy = 100;

    const angle = Math.random() * 2 * Math.PI;
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
  }

  move(canvas) {
    this.x += this.speed * this.dx;
    this.y += this.speed * this.dy;

    const bounce = (coord, limit, axis) => {
      if (coord < this.radius) {
        this[axis] = this.radius;
        this["d" + axis] *= -1;
      } else if (coord > limit - this.radius) {
        this[axis] = limit - this.radius;
        this["d" + axis] *= -1;
      }
    };

    bounce(this.x, canvas.width, "x");
    bounce(this.y, canvas.height, "y");
  }

  isCloseTo(other, threshold = 15) {
    const dy = this.y - other.y;
    const dx = this.x - other.x;
    return dx * dx + dy * dy < threshold * threshold;
  }

  getDistanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getClosest(others) {
    return others.reduce((a, b) =>
      this.getDistanceTo(a) < this.getDistanceTo(b) ? a : b
    );
  }

  // render(ctx) {
  //   ctx.fillStyle = this.color;
  //   ctx.beginPath();
  //   ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  //   ctx.fill();

  //   ctx.beginPath();
  //   ctx.arc(this.x, this.y, this.visionRange, 0, 2 * Math.PI);
  //   ctx.strokeStyle = "rgba(203, 206, 206, 0.2)"; // vert semi-transparent
  //   ctx.stroke();

  //   ctx.fillStyle = "black"; // couleur texte (tu peux ajuster)
  //   ctx.font = `${this.radius}px Arial`; // taille relative au rayon
  //   ctx.textAlign = "center";
  //   ctx.textBaseline = "middle";
  //   ctx.fillText(Math.floor(this.energy), this.x, this.y);
  // }

  render(ctx) {
    const img = sprites[this.type]; // ou autre clé
    ctx.drawImage(
      img,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }

  update(entities, engine) {
    this.energy -= 0.05;
    if (this.energy <= 0) {
      this.dead = true; // ou déclenche une suppression
    }
    this.move(engine.canvas);
    for (const other of entities) {
      if (other === this || !this.isCloseTo(other)) continue;
      this.interactWith(other, engine);
    }
  }

  interactWith(other, engine) {
    // à redéfinir dans les sous-classes
  }
}
