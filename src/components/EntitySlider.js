import React from "react";
import "./EntitySlider.css";

export default function EntitySlider({ value, onChange }) {
  return (
    <div className="entity-slider">
      <label htmlFor="entityRange">
        <strong>Entities:</strong> {value}
      </label>
      <input
        id="entityRange"
        type="range"
        min="3"
        max="200"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
