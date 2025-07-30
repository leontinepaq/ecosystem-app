import { useCallback, useEffect, useRef, useState } from "react";
import { GameEngine } from "../engine/GameEngine";
import drawBackground from "../graphics/drawBackground";
import { loadSprites } from "../graphics/sprites";

export default function useGameEngine(canvasRef) {
  const engineRef = useRef(null);
  const [entityCount, setEntityCount] = useState(90);
  const [speciesCount, setSpeciesCount] = useState({});
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
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
    setHasStarted(false);
  }, []);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
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
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      engineRef.current = new GameEngine(ctx, canvas, handleEnd);
      engineRef.current.onUpdateStats = updateStats;
      engineRef.current.start(entityCount);
      setHasStarted(true);
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
    let isMounted = true;

    loadSprites(() => {
      if (isMounted) {
        setupCanvas();
        startEngine();
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
  }, [setupCanvas, startEngine]);

  return {
    hasStarted,
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
