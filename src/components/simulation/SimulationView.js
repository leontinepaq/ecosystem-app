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
      <Canvas ref={canvasRef} />
      <SpeciesStats counts={speciesCount} total={totalAnimals} />
      {isOver ? (
        <EndScreen
          duration={duration}
          lastSpecies={lastSpecies}
          onRestart={onRestart}
        />
      ) : (
        <button
          id="restartBtn"
          onClick={onRestart}
          style={{ position: "absolute", right: "10px", top: "10px", opacity: 0.80}}>
          ⟲
        </button>
      )}
    </div>
  );
}

export default SimulationView;
