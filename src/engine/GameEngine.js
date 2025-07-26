import { createEntity } from "../game/createEntity";
import drawBackground from "../graphics/drawBackground";

export class GameEngine {
  constructor(ctx, canvas, onEndCallback) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.entities = [];
    this.running = false;
    this.lastTimestamp = 0;
    this.onEnd = onEndCallback;
    this.startTime = Date.now();

    this.onUpdateStats = null; // à définir depuis l’extérieur si besoin
  }

  initEntities(total = 200, types = ["chicken", "fox", "snake"]) {
    this.entities = []; // vider avant init
    for (let i = 0; i < total; i++) {
      const type = types[i % types.length];
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.entities.push(createEntity(type, x, y));
    }
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  update(delta) {
    for (const entity of this.entities) {
      entity.update(this.entities, this);
    }
    this.entities = this.entities.filter((e) => !e.dead);

    if (this.onUpdateStats) {
      const counts = {};
      for (const a of this.entities) {
        counts[a.type] = (counts[a.type] || 0) + 1;
      }
      this.onUpdateStats(counts);
    }

    this.checkEndCondition();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawBackground(this.ctx, this.canvas);
    for (const entity of this.entities) {
      entity.render(this.ctx);
    }
  }

  loop = (timestamp) => {
    if (!this.running) return;

    const delta = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    this.update(delta);
    this.draw();

    requestAnimationFrame(this.loop);
  };

  start() {
    this.running = true;
    this.lastTimestamp = performance.now();
    this.startTime = Date.now();
    this.initEntities();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
  }

  checkEndCondition() {
    const livingSpecies = [...new Set(this.entities.map((a) => a.type))];
    if (livingSpecies.length === 1 && this.entities.length > 0) {
      const durationMs = Date.now() - this.startTime;
      this.onEnd?.(livingSpecies[0], durationMs);
      this.stop();
    }
  }
}
