import React from 'react';
import './RoundCounter.css';

interface RoundCounterProps {
  currentRound: number;
  totalRounds: number;
}

const RoundCounter: React.FC<RoundCounterProps> = ({ currentRound, totalRounds }) => {
  return (
    <div className="round-counter">
      <h2>Ronda {currentRound} de {totalRounds}</h2>
      <div className="round-dots">
        {Array.from({ length: totalRounds }).map((_, index) => (
          <div 
            key={index}
            className={`round-dot ${index + 1 === currentRound ? 'active' : ''} ${index + 1 < currentRound ? 'completed' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RoundCounter;
