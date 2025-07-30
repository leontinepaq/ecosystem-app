const MUTATION_RATE = 0.05;

export default class Traits {
  constructor({ aggression, fear, curiosity, sociability, fertilityBias } = {}) {
    this.aggression = aggression ?? Math.random();
    this.fear = fear ?? Math.random();
    this.curiosity = curiosity ?? Math.random();
    this.sociability = sociability ?? Math.random();
    this.fertilityBias = fertilityBias ?? Math.random();
  }

  static inherit(parent1, parent2, mutationRate = MUTATION_RATE) {
    const averageAndMutate = (val1, val2) => {
      const avg = (val1 + val2) / 2;
      const mutation = (Math.random() * 2 - 1) * mutationRate;
      return Math.max(0, Math.min(1, avg + mutation));
    };

    return new Traits({
      aggression: averageAndMutate(parent1.aggression, parent2.aggression),
      fear: averageAndMutate(parent1.fear, parent2.fear),
      curiosity: averageAndMutate(parent1.curiosity, parent2.curiosity),
      sociability: averageAndMutate(parent1.sociability, parent2.sociability),
      fertilityBias: averageAndMutate(parent1.fertilityBias, parent2.fertilityBias),
    });
  }
}
