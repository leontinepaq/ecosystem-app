import React from "react";
import "./SpeciesStats.css";
import { SPECIES_CONFIG } from "../../game/species";

const ORDERED_SPECIES = ["chicken", "fox", "snake"];

function SpeciesStats({ counts, total }) {
  return (
    <div className="species-stats">
      {ORDERED_SPECIES.map((species) => {
        const count = counts[species] || 0;
        const percent = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

        return (
          <div key={species} className="species-line">
            <strong>{species}</strong>: {count} ({percent}%)
            <div
              className="bar"
              style={{
                width: `${percent}%`,
                backgroundColor: SPECIES_CONFIG[species].color,
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}


export default SpeciesStats;
