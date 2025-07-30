import Button from "../common/Button";
import "./EndScreen.css";

function EndScreen({ duration, lastSpecies, onRestart }) {
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);

  return (
    <div className="end-screen">
      <h2>The simulation ended</h2>
      <p>Duration: {minutes} min {seconds} sec</p>
      <p>Last specy alive: <strong>{lastSpecies}</strong></p>
      <Button onClick={onRestart}>⟲ New simulation</Button>
    </div>
  );
}

export default EndScreen;
