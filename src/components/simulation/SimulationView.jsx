import React, { useEffect } from "react"; 
import SpeciesStats from "./SpeciesStats";
import TraitsStats from "./TraitsStats";
import Canvas from "./Canvas";
import EndScreen from "./EndScreen";
import Button from "../common/Button";
import { toggleDebugMode } from "../../engine/GameEngine"; 
import "./SimulationView.css";

function SimulationView({
  canvasRef,
  speciesCount,
  totalAnimals,
  traitsStats,
  isOver,
  duration,
  lastSpecies,
  onRestart,
}) {
  // Debug mode with Ctrl+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        toggleDebugMode();
        console.log(`Traits stats: ${JSON.stringify(traitsStats, null, 2)}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [traitsStats]);

  return (
    <div className="simulation-view">
      <Canvas ref={canvasRef} />
      <SpeciesStats counts={speciesCount} total={totalAnimals} />
      <TraitsStats traits={traitsStats} />
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
