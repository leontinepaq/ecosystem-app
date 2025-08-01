export const SPECIES_CONFIG = {
  chicken: {
    color: "#e0c27a",
    radius: 8,
    reproductionCooldown: 1000, // plus rapide
    reproductionChance: 0.9, // plus élevé
    preyTypes: ["snake"], // chasse les snakes
    speed: 1.6, // un peu plus rapide
    visionRange: 80, // peut voir arriver les prédateurs
  },

  fox: {
    color: "#d87236",
    radius: 10,
    reproductionCooldown: 4500,
    reproductionChance: 0.02,
    preyTypes: ["chicken"], // chasse les chickens
    speed: 1.8, // un peu ralenti
    visionRange: 160, // bonne vision
  },

  snake: {
    color: "#77aa77",
    radius: 6,
    reproductionCooldown: 2500, // plus rapide
    reproductionChance: 0.5, // un peu plus facile
    preyTypes: ["fox"], // chasse les foxes
    speed: 2.6, // très rapide
    visionRange: 120, // assez bonne
  },
};
