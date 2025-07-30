import React, { useRef, useState } from "react";
import SimulationSetup from "./components/setup/SimulationSetup";
import SimulationView from "./components/simulation/SimulationView";
import useGameEngine from "./hooks/useGameEngine";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [isSettingUp, setIsSettingUp] = useState(true);
  const gameEngine = useGameEngine(canvasRef);

  const handleStart = () => {
    setIsSettingUp(false);
  };

  const handleRestart = () => {
    setIsSettingUp(true);
    gameEngine.restart();
  };

  return (
    <div className="App">
      {isSettingUp ? (
        <SimulationSetup
          entityCount={gameEngine.entityCount}
          onEntityCountChange={gameEngine.setEntityCount}
          onStart={handleStart}
        />
      ) : (
        <SimulationView
          canvasRef={canvasRef}
          speciesCount={gameEngine.speciesCount}
          totalAnimals={gameEngine.totalAnimals}
          isOver={gameEngine.isOver}
          duration={gameEngine.duration}
          lastSpecies={gameEngine.lastSpecies}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
