import { Entity } from "../Entity";
import { ENTITY_COLORS } from "../../graphics/colors";

export class Snake extends Entity {
  constructor(x, y) {
    super(x, y, "snake");
    this.color = ENTITY_COLORS.snake;
    this.radius = 10;
  }

  update(canvas) {
    // Pour l’instant, juste un déplacement simple
    this.move(canvas);
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
