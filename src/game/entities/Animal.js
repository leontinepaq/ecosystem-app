import { Entity } from "../Entity.js";
import { SPECIES_CONFIG } from "../species.js";
import { createEntity } from "../createEntity.js";

export class Animal extends Entity {
  constructor(x, y, type) {
    const config = SPECIES_CONFIG[type];
    super(x, y, type, config.color);
    this.applySpeciesConfig(config);
    this.lastReproduction = Date.now();
    this.energy = Math.random() * 70 + 30;
    this.maxEnergy = 100;
  }

  applySpeciesConfig(config) {
    const randomize = (base, variation = 0.1) => {
      const delta = base * variation;
      return base + (Math.random() * 2 - 1) * delta; // +/- variation%
    };

    this.radius = randomize(config.radius ?? 5, 0.15); // ±15%
    this.reproductionCooldown = config.reproductionCooldown ?? 5000;
    this.reproductionChance = config.reproductionChance ?? 0.5;
    this.preyTypes = config.preyTypes ?? [];
    this.speed = randomize(config.speed ?? 1.0, 0.2); // ±20%
    this.visionRange = randomize(config.visionRange ?? 100, 0.1); // ±10%
    this.nutrition = this.radius * 5;
  }

  update(entities, engine) {
    this.consumeEnergy();

    if (this.energy <= 0) {
      this.dead = true;
      return;
    }

    const { preys, predators, mates } = this.scanSurroundings(entities, engine);

    this.behavior(preys, predators, mates, engine);

    this.move(engine.canvas);
  }

  consumeEnergy() {
    this.energy -= 0.002 * this.radius;
  }

  scanSurroundings(entities, engine) {
    const preys = [];
    const predators = [];
    const mates = [];

    for (const other of entities) {
      if (other === this || other.dead) continue;

      const distance = this.getDistanceTo(other);

      if (distance < this.visionRange) {
        if (this.preyTypes.includes(other.type)) preys.push(other);
        if (SPECIES_CONFIG[other.type].preyTypes?.includes(this.type))
          predators.push(other);
        if (this.type === other.type) mates.push(other);
      }
      if (distance < (this.radius + other.radius) / 2) {
        this.interactWith(other, engine, mates);
      }
    }
    return { preys, predators, mates };
  }

  behavior(preys, predators, mates, engine) {
    if (predators.length > 0) {
      this.flee(predators);
    } else if (preys.length > 0 && (this.energy < 70 || mates.length === 0)) {
      this.follow(preys);
    } else if (mates.length > 0 && this.isAbleToReproduce(engine, mates)) {
      this.follow(mates);
    } else {
      this.wander();
    }
  }

  flee(predators) {
    const predator = this.getClosest(predators);
    let dx = this.x - predator.x;
    let dy = this.y - predator.y;
    [this.dx, this.dy] = this.normalizeAndJitter(dx, dy);
  }

  follow(targets) {
    const target = this.getClosest(targets);
    let dx = target.x - this.x;
    let dy = target.y - this.y;
    [this.dx, this.dy] = this.normalizeAndJitter(dx, dy);
  }

  seekMate(mates) {
    const mate = this.getClosest(mates);
    this.follow(mate);
  }

  wander() {
    if (Math.random() < 0.01) {
      const angle = Math.random() * 2 * Math.PI;
      this.dx = Math.cos(angle);
      this.dy = Math.sin(angle);
    }
  }

  isAbleToReproduce(engine, mates) {
    return (
      engine.entities.length < 1000 &&
      mates.length < this.limitOverpopulation &&
      this.energy > 30 &&
      Date.now() - this.lastReproduction > this.reproductionCooldown
    );
  }

  tryReproduce(engine, mates) {
    if (
      this.isAbleToReproduce(engine, mates) &&
      Math.random() < this.reproductionChance
    ) {
      this.reproduce(engine);
      this.lastReproduction = Date.now();
    }
  }

  reproduce(engine) {
    const energyCost = ((this.radius * 5) / 100) * this.energy;

    const baby = createEntity(this.type, this.x + 5, this.y + 5);
    baby.energy = 10 + energyCost;

    this.energy -= energyCost;
    engine.addEntity(baby);
  }

  interactWith(other, engine, mates) {
    if (this.preyTypes.includes(other.type)) {
      this.onKill(other);
    }

    if (this.type === other.type) {
      this.tryReproduce(engine, mates);
    }
  }

  onKill(other) {
    other.dead = true;
    this.energy = Math.min(this.energy + other.nutrition, this.maxEnergy);
  }

  normalizeAndJitter(dx, dy) {
    const norm = Math.hypot(dx, dy);
    if (norm === 0) return [this.dx, this.dy];
    const angleOffset = Math.random() * 0.4 - 0.2; // [-0.2, +0.2]
    const angle = Math.atan2(dy, dx) + angleOffset;
    return [Math.cos(angle), Math.sin(angle)];
  }
}
