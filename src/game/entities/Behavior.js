export function decideBehavior(entity, context) {
  const { preys, predators, mates } = context;
  const traits = entity.traits;

  // Fuite : plus il y a de prédateurs et plus il est peureux, plus le score est élevé
  const fleeScore = predators.length * traits.fear;

  // Reproduction : plus il y a de partenaires + forte fertilité → score élevé
  const reproduceScore = mates.length * traits.fertilityBias;

  // Chasse : dépend de l'agression + proies à proximité
  const huntScore = preys.length * traits.aggression;

  // Errance : dépend de la curiosité (même si rien autour)
  const wanderScore = 0.5 + traits.curiosity * 0.5; // toujours un peu envie de bouger

  const behaviors = [
    { type: "flee", score: fleeScore, targets: predators },
    { type: "reproduce", score: reproduceScore, targets: mates },
    { type: "hunt", score: huntScore, targets: preys },
    { type: "wander", score: wanderScore, targets: [] },
  ];

  // Choisir le meilleur comportement
  const best = behaviors.reduce((a, b) => (b.score > a.score ? b : a));

  // On peut éventuellement rajouter un peu d'aléatoire pour éviter les boucles figées
  if (best.targets.length > 0) {
    best.target = best.targets[Math.floor(Math.random() * best.targets.length)];
  }

  return best;
}
