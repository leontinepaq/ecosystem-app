import { Entity } from "../Entity";
import { ENTITY_COLORS } from "../../graphics/colors";

export class Chicken extends Entity {
  constructor(x, y) {
    super(x, y, "chicken");
    this.color = ENTITY_COLORS.chicken;
    this.radius = 10;
  }

  update(canvas) {
    // Pour l’instant, juste un déplacement simple
    this.move(canvas);

    // Ici, tu pourras ajouter des comportements spécifiques :
    // ex : fuir la vipère, chercher nourriture, etc.
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  interactWith(other, entities) {
  const dx = this.x - other.x;
  const dy = this.y - other.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < this.radius + other.radius) {
    // Si c'est une autre poule → reproduction
    if (other.type === "chicken") {
      if (entities.length < 200) { // protection contre la surpopulation
        entities.push(new Chicken(this.x + 5, this.y + 5));
      }
    }

    // Si c’est une autre espèce comestible
    if (other.type === "viper") {
      // Supprimer le ver du tableau d'entités
      const index = entities.indexOf(other);
      if (index !== -1) {
        entities.splice(index, 1);
      }
    }
  }
}
}
