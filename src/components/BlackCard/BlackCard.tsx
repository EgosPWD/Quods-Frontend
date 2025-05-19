import React from 'react';
import { Card } from '../../services/api';
import './BlackCard.css';

interface BlackCardProps {
  card: Card;
}

const BlackCard: React.FC<BlackCardProps> = ({ card }) => {
  return (
    <div className="black-card">
      <div className="black-card-content">
        <p>{card.text}</p>
      </div>
    </div>
  );
};

export default BlackCard;
