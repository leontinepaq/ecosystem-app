import React, { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import SpeciesStats from "./components/SpeciesStats";
import EndScreen from "./components/EndScreen";
import { GameEngine } from "./engine/GameEngine";
import { loadSprites } from "./graphics/sprites";
import drawBackground from "./graphics/drawBackground";

function App() {
  // États pour stats, fin de simulation, etc.
  const [speciesCount, setSpeciesCount] = useState({});
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [duration, setDuration] = useState(0);
  const [lastSpecies, setLastSpecies] = useState("");

  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  // Met à jour les stats à partir de l'objet counts
  const updateStats = useCallback((counts) => {
    setSpeciesCount(counts);
    setTotalAnimals(Object.values(counts).reduce((a, b) => a + b, 0));
  }, []);

  // Callback appelée à la fin de la simulation
  const handleEnd = useCallback((species, durationMs) => {
    setIsOver(true);
    setDuration(durationMs);
    setLastSpecies(species);
  }, []);

  // Initialise le canvas : taille + arrière-plan
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawBackground(ctx, canvas);
  }, []);

  // Instancie et démarre le moteur de jeu
  const startEngine = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");
    engineRef.current = new GameEngine(ctx, canvasRef.current, handleEnd);
    engineRef.current.onUpdateStats = updateStats;
    engineRef.current.start();
  }, [handleEnd, updateStats]);

  // Gestion du resize de fenêtre
  useEffect(() => {
    loadSprites(() => {
      setupCanvas();
      startEngine();
    });

    const onResize = () => {
      setupCanvas();
      if (engineRef.current?.onResize) {
        engineRef.current.onResize();
      }
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      engineRef.current?.stop();
    };
  }, [setupCanvas, startEngine]);

  // Relance la simulation
  const restart = () => {
    setIsOver(false);
    setDuration(0);
    setLastSpecies("");
    setSpeciesCount({});
    setTotalAnimals(0);

    engineRef.current?.stop();
    startEngine();
  };

  return (
    <div className="App">
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
