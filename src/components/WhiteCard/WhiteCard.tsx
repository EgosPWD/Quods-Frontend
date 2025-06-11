import React from 'react';
import { Card } from '../../services/api';
import './WhiteCard.css';

interface WhiteCardProps {
  card: Card;
  selected: boolean;
  disabled: boolean;
  disappearing?: boolean;
  onSelect: () => void;
}

const WhiteCard: React.FC<WhiteCardProps> = ({ card, selected, disabled, disappearing = false, onSelect }) => {
  
  const handleClick = () => {
    if (!disabled && !disappearing) {
      onSelect();
    }
  };

  const cardClassName = `white-card ${selected ? 'selected' : ''} ${disabled && !selected ? 'disabled' : ''} ${disappearing ? 'disappearing' : ''}`;

  return (
    <div className={cardClassName} onClick={handleClick}>
      <div className="white-card-content">
        <p>{card.text}</p>
      </div>
      {selected && (
        <div className="selected-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#111"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default WhiteCard;
