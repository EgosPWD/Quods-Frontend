import React, { useState, useEffect } from 'react';
import { Card, selectBlackCards, selectWhiteCards, selectOneWhiteCard } from '../../services/api';
import BlackCard from '../BlackCard/BlackCard';
import WhiteCard from '../WhiteCard/WhiteCard';
import RoundCounter from '../RoundCounter/RoundCounter';
import './CardGame.css';

interface CardGameProps {
  onGameComplete: (selectedCards: { round: number; blackCard: Card; whiteCard: Card }[]) => void;
}

const CardGame: React.FC<CardGameProps> = ({ onGameComplete }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [blackCards, setBlackCards] = useState<Card[]>([]);
  const [roundWhiteCards, setRoundWhiteCards] = useState<{[key: number]: Card[]}>({});
  const [selectedWhiteCards, setSelectedWhiteCards] = useState<{ [round: number]: Card }>({});
  const [gameResults, setGameResults] = useState<{ round: number; blackCard: Card; whiteCard: Card }[]>([]);
  const [loadingRound, setLoadingRound] = useState(false);
  
  // TRondas
  const TOTAL_ROUNDS = 5;
  // Numero de cartas blancas por ronda
  const WHITE_CARDS_PER_ROUND = 10;

  useEffect(() => {
    const fetchInitialCards = async () => {
      try {
        setLoading(true);
        
        const blackCardsData = await selectBlackCards();
        const randomBlackCards = getRandomCards(blackCardsData, TOTAL_ROUNDS);
        setBlackCards(randomBlackCards);
        
        await loadWhiteCardsForRound(1);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar las cartas");
        setLoading(false);
        console.error(err);
      }
    };

    fetchInitialCards();
  }, []);

  useEffect(() => {
    const prepareNextRound = async () => {
      if (!loadingRound && !roundWhiteCards[currentRound]) {
        await loadWhiteCardsForRound(currentRound);
      }
    };

    prepareNextRound();
  }, [currentRound, loadingRound, roundWhiteCards]);

  const loadWhiteCardsForRound = async (round: number) => {
    if (roundWhiteCards[round] && roundWhiteCards[round].length > 0) {
      console.log(`Cards for round ${round} are already loaded`);
      return;
    }

    try {
      setLoadingRound(true);
      console.log(`Loading white cards for round ${round}...`);
      
      const whiteCardsData = await selectWhiteCards();
      
      const roundCards = getRandomCards(whiteCardsData, WHITE_CARDS_PER_ROUND);
      
      console.log(`Loaded ${roundCards.length} white cards for round ${round}`);
      
      setRoundWhiteCards(prev => ({
        ...prev,
        [round]: roundCards
      }));
      
    } catch (err) {
      console.error(`Error loading cards for round ${round}:`, err);
      setError(`Error loading cards for round ${round}`);
    } finally {
      setLoadingRound(false);
    }
  };

  const getRandomCards = (cards: Card[], count: number): Card[] => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getCurrentBlackCard = (): Card | undefined => {
    return blackCards[currentRound - 1];
  };

  const getCurrentWhiteCards = (): Card[] => {
    if (roundWhiteCards[currentRound]) {
      return roundWhiteCards[currentRound];
    }
    return [];
  };

  const replaceWhiteCard = async (selectedCard: Card) => {
    try {
      const newCard = await selectOneWhiteCard();
      
      const currentCards = roundWhiteCards[currentRound] || [];
      
      const updatedCards = currentCards.map((card: Card) => 
        card.id === selectedCard.id ? newCard : card
      );
      
      setRoundWhiteCards(prev => ({
        ...prev,
        [currentRound]: updatedCards
      }));
    } catch (error) {
      console.error("Error replacing white card:", error);
    }
  };

  const handleWhiteCardSelect = async (card: Card) => {
    const updatedSelectedCards = {
      ...selectedWhiteCards,
      [currentRound]: card
    };
    
    setSelectedWhiteCards(updatedSelectedCards);
    
    const currentBlackCard = getCurrentBlackCard();
    let updatedResults = [...gameResults];
    
    if (currentBlackCard) {
      updatedResults = [
        ...gameResults.filter(result => result.round !== currentRound),
        { round: currentRound, blackCard: currentBlackCard, whiteCard: card }
      ];
      setGameResults(updatedResults);
    }

    if (currentRound === 1) {
      await replaceWhiteCard(card);
    } else {
      if (currentRound < TOTAL_ROUNDS) {
        const nextRound = currentRound + 1;
        
        if (!roundWhiteCards[nextRound]) {
          loadWhiteCardsForRound(nextRound);
        }
        
        setTimeout(() => {
          setCurrentRound(nextRound);
        }, 1000);
      } else {
        setTimeout(() => {
          onGameComplete(updatedResults);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    console.log(`Round changed to ${currentRound}`);
    console.log(`Available roundWhiteCards keys: ${Object.keys(roundWhiteCards).join(', ')}`);
    
    Object.entries(roundWhiteCards).forEach(([round, cards]) => {
      console.log(`Round ${round} has ${cards.length} cards`);
    });
  }, [currentRound, roundWhiteCards]);

  if (loading) {
    return <div className="card-game-loading">Cargando cartas...</div>;
  }

  if (error) {
    return <div className="card-game-error">{error}</div>;
  }

  const currentBlackCard = getCurrentBlackCard();
  const currentWhiteCards = getCurrentWhiteCards();
  const selectedCard = selectedWhiteCards[currentRound];
  
  // Deugging manual
  console.log(`Rendering round ${currentRound}`);
  console.log(`Black card:`, currentBlackCard);
  console.log(`White cards: ${currentWhiteCards.length} cards available for round ${currentRound}`);

  if (loadingRound && currentWhiteCards.length === 0) {
    return <div className="card-game-loading">Cargando cartas para la ronda {currentRound}...</div>;
  }

  return (
    <div className="card-game-container">
      <RoundCounter currentRound={currentRound} totalRounds={TOTAL_ROUNDS} />
      
      <div className="black-card-section">
        {currentBlackCard && <BlackCard card={currentBlackCard} />}
      </div>

      <div className="round-info">
        {currentRound === 1 ? (
          <p className="round-instructions">Selecciona una carta blanca. Se repondrán automáticamente.</p>
        ) : (
          <p className="round-instructions">Selecciona una carta blanca para completar la frase.</p>
        )}
      </div>
      
      <div className="white-cards-section">
        {currentWhiteCards.map((card) => (
          <WhiteCard 
            key={`${card.id}-${card.text}`} 
            card={card} 
            selected={selectedCard?.id === card.id}
            disabled={!!selectedCard && selectedCard.id !== card.id} 
            onSelect={() => handleWhiteCardSelect(card)} 
          />
        ))}
      </div>

      {currentRound === 1 && selectedCard && (
        <div className="next-round-button">
          <button 
            onClick={() => {
              const nextRound = currentRound + 1;
              console.log(`Button clicked: Moving to round ${nextRound}`);
              
              if (!roundWhiteCards[nextRound]) {
                loadWhiteCardsForRound(nextRound);
              }
              
              setCurrentRound(nextRound);
            }}
            className="next-round-btn"
          >
            Siguiente Ronda
          </button>
        </div>
      )}
    </div>
  );
};

export default CardGame;
