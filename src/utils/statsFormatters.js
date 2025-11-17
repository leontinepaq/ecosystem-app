// utils/statsFormatters.js

export const TRAIT_KEYS = [
  "aggression",
  "fear",
  "curiosity",
  "sociability",
  "fertilityBias"
];

export function formatRadarDataset(traits) {
  // traits = { aggression: 0.61, fear: 0.34, ... }

  return {
    labels: TRAIT_KEYS,
    data: TRAIT_KEYS.map(key => traits[key] ?? 0), // fallback si espèce éteinte
  };
}

