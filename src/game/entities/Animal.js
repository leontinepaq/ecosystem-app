import { Entity } from "../Entity.js";
import { SPECIES_CONFIG } from "../species.js";
import { createEntity } from "../createEntity.js";
import { decideBehavior } from "./Behavior.js";
import Traits from "./Traits.js";

export class Animal extends Entity {
  constructor(x, y, type) {
    const config = SPECIES_CONFIG[type];
    super(x, y, type, config.color);
    this.applySpeciesConfig(config);
    this.lastReproduction = Date.now();
    this.energy = Math.random() * 70 + 30;
    this.maxEnergy = 100;
    this.traits = new Traits();
    this.generation = 0; // pour le suivi de l'évolution
    this.age = 0; // en secondes ou ticks
    this.maxAge = 15 + Math.random() * 15; // par ex. entre 1 et 2 minutes (ajuste comme tu veux)
  }

  applySpeciesConfig(config) {
    const randomize = (base, variation = 0.1) => {
      const delta = base * variation;
      return base + (Math.random() * 2 - 1) * delta; // +/- variation%
    };

    this.radius = randomize(config.radius ?? 5, 0.15) / 2; // ±15%
    this.reproductionCooldown = config.reproductionCooldown ?? 5000;
    this.reproductionChance = config.reproductionChance ?? 0.5;
    this.preyTypes = config.preyTypes ?? [];
    this.speed = randomize(config.speed ?? 1.0, 0.2); // ±20%
    this.visionRange = randomize(config.visionRange ?? 100, 0.1); // ±10%
    this.nutrition = this.radius * 5;
  }

  update(entities, engine, delta) {
    this.age += delta / 1000;
    this.consumeEnergy();

    if (this.age >= this.maxAge * 0.8) {
      this.energy -= 0.005; // fatigue de vieillesse
    }
    if (this.age >= this.maxAge) {
      this.dead = true;
      return;
    }

    if (this.energy <= 0) {
      this.dead = true;
      return;
    }

    this.behave(engine);

    this.move(engine.canvas);
  }

  consumeEnergy() {
    this.energy -= 0.002 * this.radius;
  }

  scanSurroundings(engine) {
    const nearby = engine.getNearbyEntities(this);
    return this.classifyEntities(nearby, engine);
  }

  classifyEntities(nearbyEntities) {
    const preys = [];
    const predators = [];
    const mates = [];
    const touchingEntities = [];

    for (const other of nearbyEntities) {
      if (this.preyTypes.includes(other.type)) {
        preys.push(other);
      }
      if (SPECIES_CONFIG[other.type]?.preyTypes?.includes(this.type)) {
        predators.push(other);
      }
      if (this.type === other.type) {
        mates.push(other);
      }
      if (this.isTouching(other)) {
        touchingEntities.push(other);
      }
    }
    return { preys, predators, mates, touchingEntities };
  }

  behave(engine) {
    const context = this.scanSurroundings(engine);
    const behavior = decideBehavior(this, context, this.isAbleToReproduce);

    for (const other of context.touchingEntities) {
      this.interactWith(other, engine, context.mates);
    }

    switch (behavior.type) {
      case "flee":
        this.flee(behavior.targets);
        break;
      case "reproduce":
        this.follow(behavior.targets);
        break;
      case "hunt":
        this.follow(behavior.targets);
        break;
      case "wander":
        this.wander();
        break;
      default:
        this.wander(); //a changer
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

  isAbleToReproduce(mates) {
    return (
      mates.length < this.limitOverpopulation &&
      this.energy > 30 &&
      Date.now() - this.lastReproduction > this.reproductionCooldown
    );
  }

  tryReproduce(engine, mates) {
    if (this.isAbleToReproduce(mates) && Math.random() < this.reproductionChance) {
      this.reproduce(engine);
      this.lastReproduction = Date.now();
    }
  }

  reproduce(engine) {
    const energyCost = ((this.radius * 5) / 100) * this.energy;

    const baby = createEntity(this.type, this.x + 5, this.y + 5);
    baby.energy = 10 + energyCost;
    baby.traits = Traits.inherit(this.traits, this.traits); // Par défaut auto-clonage si seul parent
    baby.generation = this.generation + 1; // Incrémente la génération

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

  canSee(other) {
    return this.getDistanceTo(other) < this.visionRange;
  }

  isTouching(other) {
    return this.getDistanceTo(other) < (this.radius + other.radius) / 2;
  }

  normalizeAndJitter(dx, dy) {
    const norm = Math.hypot(dx, dy);
    if (norm === 0) return [this.dx, this.dy];
    const angleOffset = Math.random() * 0.4 - 0.2; // [-0.2, +0.2]
    const angle = Math.atan2(dy, dx) + angleOffset;
    return [Math.cos(angle), Math.sin(angle)];
  }
}
