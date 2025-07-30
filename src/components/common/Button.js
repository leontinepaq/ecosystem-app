import React from "react";
import "./Button.css";

function Button({ children, onClick, className = "", style = {} }) {
  return (
    <button
      className={`app-button ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
