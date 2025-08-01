import React from "react";
import "./TraitsStats.css";

function TraitsStats({ traits }) {
  return (
    <div className="traits-stats">
      {traits &&
        Object.entries(traits).map(([type, data]) => (
          <div key={type} className="traits-summary">
            <strong>{type}</strong>
            {Object.entries(data)
              .filter(([key]) => key !== "count")
              .map(([trait, value]) => (
                <div key={trait} className="trait-line">
                  {trait}: {value.toFixed(2)}
                </div>
              ))}
          </div>
        ))}
    </div>
  );
}

export default TraitsStats;
