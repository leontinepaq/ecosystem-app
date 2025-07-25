export const SPECIES_CONFIG = {
  chicken: {
    color: "#e0c27a",
    radius: 8,
    reproductionCooldown: 1500, // plus rapide
    reproductionChance: 0.7, // plus élevé
    preyTypes: ["snake"], // chasse les snakes
    speed: 1.8, // un peu plus rapide
    visionRange: 60, // peut voir arriver les prédateurs
	nutrition: 30,
  },

  fox: {
    color: "#d87236",
    radius: 10,
    reproductionCooldown: 7000,
    reproductionChance: 0.1,
    preyTypes: ["chicken"], // chasse les chickens
    speed: 2.2, // un peu ralenti
    visionRange: 160, // bonne vision
	nutrition: 50,
  },

  snake: {
    color: "#77aa77",
    radius: 6,
    reproductionCooldown: 6000, // plus rapide
    reproductionChance: 0.35, // un peu plus facile
    preyTypes: ["fox"], // chasse les foxes
    speed: 2.5, // très rapide
    visionRange: 120, // assez bonne
	nutrition: 40,
  },
};
