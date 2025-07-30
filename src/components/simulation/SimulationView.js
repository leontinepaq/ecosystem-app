import React from "react";
import SpeciesStats from "./SpeciesStats";
import Canvas from "./Canvas";
import EndScreen from "./EndScreen";

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
      <SpeciesStats counts={speciesCount} total={totalAnimals} />
      <Canvas ref={canvasRef} />
      {isOver && (
        <EndScreen
          duration={duration}
          lastSpecies={lastSpecies}
          onRestart={onRestart}
        />
      )}
    </div>
  );
}

export default SimulationView;
