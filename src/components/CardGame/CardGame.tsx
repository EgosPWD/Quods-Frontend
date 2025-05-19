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
  
  // Total number of rounds
  const TOTAL_ROUNDS = 5;
  // Number of white cards per round
  const WHITE_CARDS_PER_ROUND = 10;

  // Initial setup - fetch black cards and the first round's white cards
  useEffect(() => {
    const fetchInitialCards = async () => {
      try {
        setLoading(true);
        
        // Fetch black cards for all rounds
        const blackCardsData = await selectBlackCards();
        const randomBlackCards = getRandomCards(blackCardsData, TOTAL_ROUNDS);
        setBlackCards(randomBlackCards);
        
        // Fetch white cards for the first round only
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

  // Monitor round changes and load cards for the next round if needed
  useEffect(() => {
    const prepareNextRound = async () => {
      // If we're not already loading and cards for the current round aren't loaded yet
      if (!loadingRound && !roundWhiteCards[currentRound]) {
        await loadWhiteCardsForRound(currentRound);
      }
    };

    prepareNextRound();
  }, [currentRound, loadingRound, roundWhiteCards]);

  // Function to load white cards for a specific round
  const loadWhiteCardsForRound = async (round: number) => {
    // Don't load if we already have cards for this round
    if (roundWhiteCards[round] && roundWhiteCards[round].length > 0) {
      console.log(`Cards for round ${round} are already loaded`);
      return;
    }

    try {
      setLoadingRound(true);
      console.log(`Loading white cards for round ${round}...`);
      
      // Fetch fresh white cards from the backend
      const whiteCardsData = await selectWhiteCards();
      
      // Select random white cards for this round
      const roundCards = getRandomCards(whiteCardsData, WHITE_CARDS_PER_ROUND);
      
      console.log(`Loaded ${roundCards.length} white cards for round ${round}`);
      
      // Update the state with the new cards
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

  // Get random cards from the card array
  const getRandomCards = (cards: Card[], count: number): Card[] => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Get the current black card for this round
  const getCurrentBlackCard = (): Card | undefined => {
    return blackCards[currentRound - 1];
  };

  // Get the white cards for the current round
  const getCurrentWhiteCards = (): Card[] => {
    if (roundWhiteCards[currentRound]) {
      return roundWhiteCards[currentRound];
    }
    return [];
  };

  // Replace a selected card with a new one (only for first round)
  const replaceWhiteCard = async (selectedCard: Card) => {
    try {
      // Fetch a new white card
      const newCard = await selectOneWhiteCard();
      
      // Get current cards for this round
      const currentCards = roundWhiteCards[currentRound] || [];
      
      // Replace the selected card with the new one
      const updatedCards = currentCards.map((card: Card) => 
        card.id === selectedCard.id ? newCard : card
      );
      
      // Update cards for this round
      setRoundWhiteCards(prev => ({
        ...prev,
        [currentRound]: updatedCards
      }));
    } catch (error) {
      console.error("Error replacing white card:", error);
    }
  };

  // Handle white card selection
  const handleWhiteCardSelect = async (card: Card) => {
    // Store the selected card for this round
    const updatedSelectedCards = {
      ...selectedWhiteCards,
      [currentRound]: card
    };
    
    setSelectedWhiteCards(updatedSelectedCards);
    
    // Add the selection to results
    const currentBlackCard = getCurrentBlackCard();
    let updatedResults = [...gameResults];
    
    if (currentBlackCard) {
      updatedResults = [
        ...gameResults.filter(result => result.round !== currentRound),
        { round: currentRound, blackCard: currentBlackCard, whiteCard: card }
      ];
      setGameResults(updatedResults);
    }

    // For the first round, replace the selected card but don't advance automatically
    if (currentRound === 1) {
      await replaceWhiteCard(card);
    } else {
      // For other rounds, move to next round or end game
      if (currentRound < TOTAL_ROUNDS) {
        // Pre-load cards for the next round
        const nextRound = currentRound + 1;
        
        // Pre-load cards for the next round if not already loaded
        if (!roundWhiteCards[nextRound]) {
          // Try to load cards for the next round in the background
          loadWhiteCardsForRound(nextRound);
        }
        
        // Delay before moving to next round to show selection first
        setTimeout(() => {
          setCurrentRound(nextRound);
        }, 1000);
      } else {
        // Game complete
        setTimeout(() => {
          onGameComplete(updatedResults);
        }, 1000);
      }
    }
  };

  // Effect to log debug info when round changes
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
  
  // Debug information
  console.log(`Rendering round ${currentRound}`);
  console.log(`Black card:`, currentBlackCard);
  console.log(`White cards: ${currentWhiteCards.length} cards available for round ${currentRound}`);

  // Show a loading indicator if we're loading cards for this round
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
              
              // Pre-load cards for the next round if not already loaded
              if (!roundWhiteCards[nextRound]) {
                loadWhiteCardsForRound(nextRound);
              }
              
              // Move to next round
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
