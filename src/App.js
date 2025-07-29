import React, { useRef } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import EntitySlider from "./components/EntitySlider";
import SpeciesStats from "./components/SpeciesStats";
import EndScreen from "./components/EndScreen";
import useGameEngine from "./hooks/useGameEngine";

function App() {
  const canvasRef = useRef(null);
  const {
    entityCount,
    setEntityCount,
    speciesCount,
    totalAnimals,
    isOver,
    duration,
    lastSpecies,
    restart,
  } = useGameEngine(canvasRef);

  return (
    <div className="App">
      <EntitySlider value={entityCount} onChange={setEntityCount} />
      <SpeciesStats counts={speciesCount} total={totalAnimals} />
      <Canvas ref={canvasRef} />
      {isOver && (
        <EndScreen
          duration={duration}
          lastSpecies={lastSpecies}
          onRestart={restart}
        />
      )}
    </div>
  );
}

export default App;
