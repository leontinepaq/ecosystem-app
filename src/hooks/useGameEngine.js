import { useCallback, useEffect, useRef, useState } from "react";
import { GameEngine } from "../engine/GameEngine";
import drawBackground from "../graphics/drawBackground";
import { loadSprites } from "../graphics/sprites";

export default function useGameEngine(canvasRef, isSettingUp) {
  const engineRef = useRef(null);
  const [entityCount, setEntityCount] = useState(90);
  const [speciesCount, setSpeciesCount] = useState({});
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [duration, setDuration] = useState(0);
  const [lastSpecies, setLastSpecies] = useState("");

  const updateStats = useCallback((counts) => {
    setSpeciesCount(counts);
    setTotalAnimals(Object.values(counts).reduce((a, b) => a + b, 0));
  }, []);

  const handleEnd = useCallback((species, durationMs) => {
    setIsOver(true);
    setDuration(durationMs);
    setLastSpecies(species);
  }, []);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    console.log("setup canvas")
    if (canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawBackground(ctx, canvas);
    }
  }, [canvasRef]);

  const startEngine = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    console.log("startengine")
    const canvas = canvasRef.current;
    if (canvas) {
      console.log("Canvas ok");
      const ctx = canvas.getContext("2d");
      engineRef.current = new GameEngine(ctx, canvas, handleEnd);
      engineRef.current.onUpdateStats = updateStats;
      engineRef.current.start(entityCount);
    }
  }, [canvasRef, handleEnd, updateStats, entityCount]);

  const restart = useCallback(() => {
    setIsOver(false);
    setDuration(0);
    setLastSpecies("");
    setSpeciesCount({});
    setTotalAnimals(0);
    if (engineRef.current) {
      engineRef.current.stop();
    }
    startEngine();
  }, [startEngine]);

  useEffect(() => {
    if (!isSettingUp) {
      console.log("isSettingUp is false, starting engine...");
      setupCanvas();
      startEngine();
    }
  }, [isSettingUp, startEngine, setupCanvas]);


  useEffect(() => {
    let isMounted = true;
     console.log("useeffect");

    loadSprites(() => {
      if (isMounted) {
        setupCanvas();
      }
    });

    const onResize = () => {
      if (isMounted) {
        setupCanvas();
        if (engineRef.current?.onResize) {
          engineRef.current.onResize();
        }
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", onResize);
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, [setupCanvas]);

  return {
    entityCount,
    setEntityCount,
    speciesCount,
    totalAnimals,
    isOver,
    duration,
    lastSpecies,
    restart,
  };
}
