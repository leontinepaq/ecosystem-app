import React from "react";
import SpeciesStats from "./SpeciesStats";
import Canvas from "./Canvas";
import EndScreen from "./EndScreen";
import Button from "../common/Button";
import "./SimulationView.css";

function SimulationView({
  canvasRef,
  speciesCount,
  totalAnimals,
  isOver,
  duration,
  lastSpecies,
  onRestart,
}) {
  return (
    <div className="simulation-view">
      <Canvas ref={canvasRef} />
      <SpeciesStats counts={speciesCount} total={totalAnimals} />
      {isOver ? (
        <EndScreen
          duration={duration}
          lastSpecies={lastSpecies}
          onRestart={onRestart}
        />
      ) : (
        <Button onClick={onRestart} className="simulation-view__restart">
          ⟲
        </Button>
      )}
    </div>
  );
}

export default SimulationView;
