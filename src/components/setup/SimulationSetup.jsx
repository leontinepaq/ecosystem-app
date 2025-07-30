import React from "react";
import SpeciesCard from "./SpeciesCard";
import EntitySlider from "./EntitySlider";
import Button from "../common/Button";
import "./SimulationSetup.css";

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
    characteristics: [
      "Hunts foxes",
      "Good vision",
      "Average reproduction",
      "Very high speed",
    ],
  },
];

const SimulationSetup = ({ entityCount, onEntityCountChange, onStart }) => {
  return (
    <div className="simulation-setup">
      <h1>Set up the simulation</h1>
      <div className="species-container">
        {speciesData.map((species, index) => (
          <SpeciesCard key={index} {...species} />
        ))}
      </div>
      <EntitySlider value={entityCount} onChange={onEntityCountChange} />
      <Button className="start-button" onClick={onStart}>
        Start simulation
      </Button>
    </div>
  );
};

export default SimulationSetup;
