import React, { useEffect, useRef } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import { GameEngine } from "./engine/GameEngine";
import drawBackground from "./graphics/drawBackground";

function App() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  // Redimensionne le canvas et redessine l’arrière-plan
  const handleResize = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawBackground(ctx, canvas);

    if (engineRef.current) {
      engineRef.current.onResize?.(); // Optionnel si tu veux que ton moteur réagisse
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    handleResize();

    engineRef.current = new GameEngine(ctx, canvas);
    engineRef.current.start();

    window.addEventListener("resize", handleResize);

    return () => {
      engineRef.current?.stop();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="App">
      <Canvas ref={canvasRef} />
    </div>
  );
}

export default App;
