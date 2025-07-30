import React from 'react';
import './SpeciesCard.css';

const SpeciesCard = ({ name, image, characteristics }) => {
  return (
    <div className="species-card">
      <div className="species-image">
        <img src={image} alt={name} />
      </div>
      <h3>{name}</h3>
      <ul>
        {characteristics.map((char, index) => (
          <li key={index}>{char}</li>
        ))}
      </ul>
    </div>
  );
};

export default SpeciesCard;
