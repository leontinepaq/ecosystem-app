export function decideBehavior(entity, context, isAbleToReproduce) {
  const { preys, predators, mates } = context;
  const traits = entity.traits;

  // Fuite : plus il y a de prédateurs et plus il est peureux, plus le score est élevé
  const fleeScore = predators.length * traits.fear;

  // Reproduction : dépend de l'énergie restante et de la capacité à se reproduire
  const reproduceScore =
    (mates.length > 0 ? 1 : 0) *
    (entity.energy / entity.maxEnergy) *
    traits.fertilityBias *
    entity.isAbleToReproduce(mates);

  // Chasse : dépend de l'agression + de l'énergie restante
  // Plus l'animal est agressif et moins il a d'énergie, plus il a envie de chasser
  const huntScore =
    (preys.length > 0 ? 1 : 0) *
    ((entity.maxEnergy - entity.energy) / entity.maxEnergy) *
    traits.aggression;

  // Errance : dépend de la curiosité et de l'energie restante
  const wanderScore = 0.1 + traits.curiosity * (entity.energy / entity.maxEnergy);

  const behaviors = [
    { type: "flee",       score: fleeScore,       targets: predators },
    { type: "reproduce",  score: reproduceScore,  targets: mates },
    { type: "hunt",       score: huntScore,       targets: preys },
    { type: "wander",     score: wanderScore,     targets: [] },
  ];

  // Choisir le meilleur comportement
  const best = behaviors.reduce((a, b) => (b.score > a.score ? b : a));

  return best;
}
