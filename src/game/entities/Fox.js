// import { Entity } from "../Entity";
// import { ENTITY_COLORS } from "../../graphics/colors";

// export class Fox extends Entity {
//   constructor(x, y) {
//     super(x, y, "fox");
//     this.color = ENTITY_COLORS.fox;
//     this.radius = 10;
//   }

//   update(canvas) {
//     // Pour l’instant, juste un déplacement simple
//     this.move(canvas);
//   }

//   render(ctx) {
//     ctx.fillStyle = this.color;
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
//     ctx.fill();
//   }
// }

export class Fox {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = "fox";
    this.size = 12;
  }

  update(entities, engine) {
    for (const other of entities) {
      if (other === this) continue;

      // Manger une poule
      if (other.type === "chicken" && isClose(this, other)) {
        other.dead = true;
      }
    }

    // Mouvement plus rapide
    this.x += Math.random() * 4 - 2;
    this.y += Math.random() * 4 - 2;
  }

  render(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function isClose(a, b, threshold = 15) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) < threshold;
}
