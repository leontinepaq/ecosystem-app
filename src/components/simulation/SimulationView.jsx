import React, { useEffect } from "react"; // ← ajoute useEffect
import SpeciesStats from "./SpeciesStats";
import Canvas from "./Canvas";
import EndScreen from "./EndScreen";
import Button from "../common/Button";
import { toggleDebugMode } from "../../engine/GameEngine"; // ← importe la fonction
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
  // Debug mode with Ctrl+D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        toggleDebugMode();
        console.log("Debug mode toggled");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
