import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import { SPECIES_CONFIG } from "../../game/species";
import { TRAIT_KEYS, formatRadarDataset } from "../../utils/statsFormatters";
import "./TraitsStats.css";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function TraitsStats({ traits }) {
  if (!traits) return null;

  return (
    <div className="traits-radar-container">
      {["chicken", "fox", "snake"].map((species) => {
        const dataForSpecies = traits[species];

        // fallback si espèce éteinte
        const safeTraits =
          dataForSpecies ||
          TRAIT_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

        const { labels, data } = formatRadarDataset(safeTraits);

        return (
          <div key={species} className="traits-radar-item">
            <h3 className="species-title">{species}</h3>

            <Radar
              data={{
                labels,
                datasets: [
                  {
                    label: species,
                    data,
                    backgroundColor: SPECIES_CONFIG[species].color + "33",
                    borderColor: SPECIES_CONFIG[species].color,
                    borderWidth: 2,
                    pointBackgroundColor: SPECIES_CONFIG[species].color
                  }
                ]
              }}
              options={{
                scales: {
                  r: {
                    min: 0,
                    max: 1,
                    ticks: { display: false },
                    grid: { color: "#ccc" },
                    pointLabels: { font: { size: 12 } }
                  }
                },
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default TraitsStats;



// import React from "react";
// import "./TraitsStats.css";

// const ORDERED_SPECIES = ["chicken", "fox", "snake"];

// function TraitsStats({ traits }) {
//   return (
//     <div className="traits-stats">
//       {ORDERED_SPECIES.map((species) => {
//         const data = traits?.[species];
//         const safeData = data || { count: 0};
//         return (
//           <div key={species} className="traits-summary">
//             <strong>{species}</strong>

//             {Object.entries(safeData)
//               .filter(([key]) => key !== "count")
//               .map(([trait, value]) => (
//                 <div key={trait} className="trait-line">
//                   {trait}: {Number(value).toFixed(2)}
//                 </div>
//               ))}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default TraitsStats;
