import { sprites } from "../graphics/sprites";
import { isDebugMode } from "../engine/GameEngine";
import { drawDisc, drawImage } from "../graphics/drawUtils";

export class Entity {
  constructor(x, y, type, color) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.radius = 10;
    this.dead = false;
    this.limitOverpopulation = 10;
    this.lastReproduction = Date.now();
    this.reproductionCooldown = 3000;
    this.speed = 1;
    this.energy = 100;
    this.maxEnergy = 100;

    const angle = Math.random() * 2 * Math.PI;
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
  }

  move(canvas) {
    this.x += 2 * this.speed * this.dx;
    this.y += 2 * this.speed * this.dy;

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

  renderSprite(ctx) {
    const img = sprites[this.type];
    const x = this.x - this.radius;
    const y = this.y - this.radius;
    const width = this.radius * 2;
    const height = this.radius * 2;
    const alpha = this.energy >= 30 ? 1 : 0.2 + (this.energy / 30) * 0.8;
    drawImage(ctx, img, x, y, width, height, alpha);
  }

  renderVisionCircle(ctx) {
    if (!this.visionRange) return;
    drawDisc(ctx, this.x, this.y, this.visionRange, this.color, 0.1);
  }

  renderDebugInfo(ctx) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = "8px sans-serif";
    ctx.fillText(`${this.generation}`, this.x -2, this.y - 10);
    ctx.restore();
  }

  render(ctx) {
    if (isDebugMode()) {
      this.renderVisionCircle(ctx);
      this.renderDebugInfo(ctx);
    }
    this.renderSprite(ctx);
  }
}
