import React from "react";
import SpeciesCard from "./SpeciesCard";
import EntitySlider from "./EntitySlider";
import "./SimulationSetup.css";

const SimulationSetup = ({ entityCount, onEntityCountChange, onStart }) => {
  const speciesData = [
    {
      name: "Chicken",
      image: "/assets/images/chicken.png",
      characteristics: [
        "Hunts snakes",
        "Moderate vision",
        "Fast reproduction",
        "Moderate speed",
      ],
    },
    {
      name: "Fox",
      image: "/assets/images/fox.png",
      characteristics: [
        "Hunts chickens",
        "High vision",
        "Slow reproduction",
        "Moderate speed",
      ],
    },
    {
      name: "Snake",
      image: "/assets/images/snake.png",
      characteristics: ["Hunts foxes", "Good vision","Average reproduction","Very high speed"],
    },
  ];

  return (
    <div className="simulation-setup">
      <h1>Set up the simulation</h1>
      <div className="species-container">
        {speciesData.map((species, index) => (
          <SpeciesCard key={index} {...species} />
        ))}
      </div>
      <EntitySlider value={entityCount} onChange={onEntityCountChange} />
      <button
        className="start-button"
        onClick={onStart}
        style={{ fontWeight: "bold" }}>
        Start simulation
      </button>
    </div>
  );
};

export default SimulationSetup;
