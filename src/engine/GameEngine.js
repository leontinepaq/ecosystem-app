import { createEntity } from "../game/createEntity";
import drawBackground from "../graphics/drawBackground";

export class GameEngine {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.entities = [];
    this.running = false;
    this.lastTimestamp = 0;
  }

  initEntities() {
    const total = 100;
    const types = ["chicken", "fox", "snake"];

    for (let i = 0; i < total; i++) {
      const type = types[i % 3];
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.entities.push(createEntity(type, x, y));
    }
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  update() {
    for (const entity of this.entities) {
      entity.update(this.entities, this);
    }
    this.entities = this.entities.filter((e) => !e.dead);
	
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawBackground(this.ctx, this.canvas);
    for (const entity of this.entities) {
      entity.render(this.ctx); // appel render spécifique à chaque entité
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
    this.initEntities();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
  }
}
