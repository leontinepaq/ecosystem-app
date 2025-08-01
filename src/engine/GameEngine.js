import { createEntity } from "../game/createEntity";
import drawBackground from "../graphics/drawBackground";

const DEFAULT_ENTITY_TYPES = ["chicken", "fox", "snake"];
const DEFAULT_TOTAL_ENTITIES = 50;
let globalDebugMode = true;

export class GameEngine {
  constructor(ctx, canvas, onEndCallback) {
    if (!ctx || !canvas) {
      throw new Error("Context and canvas must be provided");
    }

    this.ctx = ctx;
    this.canvas = canvas;
    this.entities = [];
    this.running = false;
    this.lastTimestamp = 0;
    this.onEnd = onEndCallback;
    this.startTime = Date.now();
    this.onUpdateStats = null; // Callback pour les statistiques

    this.instanceId = Math.random().toString(36).substr(2, 9); // Identifiant unique pour chaque instance pour debug

    console.log(`GameEngine instance created with ID: ${this.instanceId}`);
  }

  initEntities(total = DEFAULT_TOTAL_ENTITIES, types = DEFAULT_ENTITY_TYPES) {
    this.entities = []; // Vider avant l'initialisation
    for (let i = 0; i < total; i++) {
      const type = types[i % types.length];
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.entities.push(createEntity(type, x, y));
    }
  }

  addEntity(entity) {
    if (entity) {
      this.entities.push(entity);
    }
  }

  update(delta) {
    this.entities.forEach((entity) => entity.update(this.entities, this));
    this.entities = this.entities.filter((entity) => !entity.dead);

    if (this.onUpdateStats) {
      const counts = this.entities.reduce((acc, entity) => {
        acc[entity.type] = (acc[entity.type] || 0) + 1;
        return acc;
      }, {});
      this.onUpdateStats(counts);
    }

    this.checkEndCondition();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawBackground(this.ctx, this.canvas);
    this.entities.forEach((entity) => entity.render(this.ctx));
  }

  loop = (timestamp) => {
    if (!this.running) return;

    const delta = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    this.update(delta);
    this.draw();

    requestAnimationFrame(this.loop);
  };

  start(totalEntities) {
    this.running = true;
    this.lastTimestamp = performance.now();
    this.startTime = Date.now();
    this.initEntities(totalEntities);
    requestAnimationFrame(this.loop);
  }

  stop() {
    console.log(`Stopping GameEngine with ID ${this.instanceId}`);
    this.running = false;
  }

  checkEndCondition() {
    const livingSpecies = [...new Set(this.entities.map((entity) => entity.type))];

    if (livingSpecies.length === 1 && this.entities.length > 0) {
      const durationMs = Date.now() - this.startTime;
      this.onEnd?.(livingSpecies[0], durationMs);
      this.stop();
    }
  }
}

export function isDebugMode() {
  return globalDebugMode;
}

export function toggleDebugMode() {
  globalDebugMode = !globalDebugMode;
}
