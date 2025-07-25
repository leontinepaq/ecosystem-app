import { Animal } from "./Animal.js";

export class Snake extends Animal {
  constructor(x, y) {
    super(x, y, "snake");
  }
}