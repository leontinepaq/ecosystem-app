import { Entity } from "../Entity.js";
import { SPECIES_CONFIG } from "../species.js";
import { createEntity } from "../createEntity.js";

export class Animal extends Entity {
  constructor(x, y, type) {
    const config = SPECIES_CONFIG[type];
    super(x, y, type, config.color);

    this.applySpeciesConfig(config);
    this.lastReproduction = Date.now();
  }

  applySpeciesConfig(config) {
    this.radius = config.radius ?? 5;
    this.reproductionCooldown = config.reproductionCooldown ?? 5000;
    this.reproductionChance = config.reproductionChance ?? 0.5;
    this.preyTypes = config.preyTypes ?? [];
    this.speed = config.speed ?? 1.0;
    this.visionRange = config.visionRange ?? 100;
  }

  interactWith(other, engine) {
    if (this.type === other.type && engine.entities.length < 1000) {
      const now = Date.now();
      if (now - this.lastReproduction > this.reproductionCooldown) {
        this.reproduce(engine);
        this.lastReproduction = now;
      }
    }

    if (this.preyTypes.includes(other.type)) {
      other.dead = true;
      this.onKill(other);
    }
  }

  reproduce(engine) {
    if (Math.random() > this.reproductionChance && this.energy > 30)
      engine.addEntity(createEntity(this.type, this.x + 5, this.y + 5));
  }

  onKill(other) {
    this.energy = Math.min(this.energy + 40, this.maxEnergy); // recharge partielle
  }

  update(entities, engine) {
    this.energy -= 0.05;
    if (this.energy <= 0) {
      this.dead = true; // ou déclenche une suppression
    }

    // Vision
    const seenPreys = [];
    const seenPredators = [];

    for (const other of entities) {
      if (other === this || other.dead) continue;
      const distance = this.getDistanceTo(other);
      if (distance < (this.radius + other.radius) / 2)
        this.interactWith(other, engine);
      else if (distance < this.visionRange) {
        if (this.preyTypes.includes(other.type)) seenPreys.push(other);
        if (SPECIES_CONFIG[other.type].preyTypes?.includes(this.type))
          seenPredators.push(other);
      }
    }
    this.moveSmart(seenPreys, seenPredators, engine.canvas);
  }

  moveSmart(preys, predators, canvas) {
    let dx = this.dx;
    let dy = this.dy;

    if (predators.length > 0) {
      const predator = this.getClosest(predators);
      dx = this.x - predator.x;
      dy = this.y - predator.y;
      [dx, dy] = this.rotateVector(dx, dy, Math.random() * 0.4 - 0.2); // petite rotation aléatoire
    } else if (preys.length > 0) {
      const prey = this.getClosest(preys);
      dx = prey.x - this.x;
      dy = prey.y - this.y;
      [dx, dy] = this.rotateVector(dx, dy, Math.random() * 0.4 - 0.2); // petite rotation aléatoire
    } else if (Math.random() < 0.01) {
      // changement aléatoire de direction
      const angle = Math.random() * 2 * Math.PI;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
    }

    const norm = Math.hypot(dx, dy);
    if (norm > 0) {
      this.dx = dx / norm;
      this.dy = dy / norm;
    }

    this.move(canvas);
  }

  rotateVector(x, y, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [x * cos - y * sin, x * sin + y * cos];
  }
}
