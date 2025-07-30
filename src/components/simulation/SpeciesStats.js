import React from "react";
import "./SpeciesStats.css";
import { SPECIES_CONFIG } from "../../game/species";

function SpeciesStats({ counts, total }) {
  return (
    <div className="species-stats">
      {Object.entries(counts).map(([species, count]) => {
        const percent = ((count / total) * 100).toFixed(1);
        return (
          <div key={species} className="species-line">
            <strong>{species}</strong>: {count} ({percent}%)
            <div className="bar" style={{ width: `${percent}%`, backgroundColor:  SPECIES_CONFIG[species].color }}></div>
          </div>
        );
      })}
    </div>
  );
}

export default SpeciesStats;
