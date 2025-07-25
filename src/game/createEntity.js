import { Chicken } from "./entities/Chicken";
import { Fox } from "./entities/Fox";
import { Snake } from "./entities/Snake";

export function createEntity(type, x, y) {
  switch (type) {
    case "chicken":
      return new Chicken(x, y);
    case "fox":
      return new Fox(x, y);
    case "snake":
      return new Snake(x, y);
    default:
      throw new Error("Unknown entity type: " + type);
  }
}
