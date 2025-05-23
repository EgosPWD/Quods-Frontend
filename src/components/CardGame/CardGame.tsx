import React, { useState, useEffect } from 'react';
import { 
  Card, 
  selectBlackCards, 
  selectWhiteCards, 
  selectOneWhiteCard, 
  verificarRespuesta, 
  getCorrectCards 
} from '../../services/api';
import BlackCard from '../BlackCard/BlackCard';
import WhiteCard from '../WhiteCard/WhiteCard';
import RoundCounter from '../RoundCounter/RoundCounter';
import './CardGame.css';

interface CardGameProps {
  onGameComplete: (selectedCards: { round: number; blackCard: Card; whiteCard: Card; isCorrect?: boolean }[]) => void;
  roomId: string; // Required - used to fetch cards associated with this room
}

const CardGame: React.FC<CardGameProps> = ({ onGameComplete, roomId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [blackCards, setBlackCards] = useState<Card[]>([]);
  const [roundWhiteCards, setRoundWhiteCards] = useState<{[key: number]: Card[]}>({});
  const [selectedWhiteCards, setSelectedWhiteCards] = useState<{ [round: number]: Card }>({});
  const [gameResults, setGameResults] = useState<{ round: number; blackCard: Card; whiteCard: Card; isCorrect?: boolean }[]>([]);
  const [loadingRound, setLoadingRound] = useState(false);
  const [verifyingResponse, setVerifyingResponse] = useState(false);
  
  // TRondas
  const TOTAL_ROUNDS = 5;
  // Numero de cartas blancas por ronda
  const WHITE_CARDS_PER_ROUND = 10;

  useEffect(() => {
    const fetchInitialCards = async () => {
      try {
        setLoading(true);
        
        const blackCardsData = await selectBlackCards(roomId);
        
        if (!blackCardsData || blackCardsData.length === 0) {
          throw new Error("No se encontraron cartas negras para esta sala. Asegúrate de que las cartas han sido generadas.");
        }
        
        const randomBlackCards = getRandomCards(blackCardsData, TOTAL_ROUNDS);
        setBlackCards(randomBlackCards);
        
        await loadWhiteCardsForRound(1);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar las cartas");
        setLoading(false);
        console.error("Error fetching initial cards:", err);
      }
    };

    fetchInitialCards();
  }, [roomId]);

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
      
      const whiteCardsData = await selectWhiteCards(roomId);
      
      if (!whiteCardsData || whiteCardsData.length === 0) {
        throw new Error("No se encontraron cartas blancas para esta sala. Asegúrate de que las cartas han sido generadas.");
      }
      
      const roundCards = getRandomCards(whiteCardsData, WHITE_CARDS_PER_ROUND);
      
      console.log(`Loaded ${roundCards.length} white cards for round ${round}`);
      
      setRoundWhiteCards(prev => ({
        ...prev,
        [round]: roundCards
      }));
      
    } catch (err) {
      console.error(`Error loading cards for round ${round}:`, err);
      setError(err instanceof Error ? err.message : `Error al cargar cartas para la ronda ${round}`);
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
      const newCard = await selectOneWhiteCard(roomId);
      
      if (!newCard) {
        console.error("No se pudo obtener una nueva carta blanca");
        return;
      }
      
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
      setError("No se pudo reemplazar la carta blanca. Intenta de nuevo.");
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
      try {
        setVerifyingResponse(true);
        
        // Verificar si la respuesta es correcta
        const verificationResult = await verificarRespuesta({
          white_card_id: card.id,
          black_card_id: currentBlackCard.id,
          room_id: roomId
        });
        
        // Guardar el resultado con información de si es correcta o no
        updatedResults = [
          ...gameResults.filter(result => result.round !== currentRound),
          { 
            round: currentRound, 
            blackCard: currentBlackCard, 
            whiteCard: card,
            isCorrect: verificationResult.es_correcta
          }
        ];
        setGameResults(updatedResults);
        
        // Si no es correcta, obtener las respuestas correctas
        if (!verificationResult.es_correcta) {
          // Obtenemos las cartas correctas para referencia pero no necesitamos
          // almacenarlas actualmente, ya que solo estamos verificando si la respuesta es correcta
          await getCorrectCards({
            black_card_id: currentBlackCard.id,
            room_id: roomId
          });
          
          // En una versión futura, podríamos mostrar las respuestas correctas al usuario
          console.log(`La respuesta para la carta negra ${currentBlackCard.id} es incorrecta`);
        }
      } catch (err) {
        console.error("Error verificando respuesta:", err);
        // Si hay error de verificación, continuar sin la verificación
        updatedResults = [
          ...gameResults.filter(result => result.round !== currentRound),
          { round: currentRound, blackCard: currentBlackCard, whiteCard: card }
        ];
        setGameResults(updatedResults);
      } finally {
        setVerifyingResponse(false);
      }
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
        {verifyingResponse ? (
          <p className="round-instructions">Verificando tu respuesta...</p>
        ) : currentRound === 1 ? (
          <p className="round-instructions">Selecciona una carta blanca. Se repondrán automáticamente.</p>
        ) : (
          <p className="round-instructions">Selecciona una carta blanca para completar la frase.</p>
        )}
        
        {/* Mostrar resultado de la verificación si hay una carta seleccionada */}
        {selectedCard && !verifyingResponse && gameResults.some(result => result.round === currentRound && result.isCorrect !== undefined) && (
          <div className={`verification-result ${
            gameResults.find(result => result.round === currentRound)?.isCorrect 
              ? 'correct' 
              : 'incorrect'
          }`} style={{
            marginTop: '10px',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: gameResults.find(result => result.round === currentRound)?.isCorrect 
              ? '#d4edda' 
              : '#f8d7da',
            color: gameResults.find(result => result.round === currentRound)?.isCorrect 
              ? '#155724' 
              : '#721c24'
          }}>
            {gameResults.find(result => result.round === currentRound)?.isCorrect 
              ? '¡Respuesta correcta! 🎉' 
              : '❌ Respuesta incorrecta. Continúa para ver la siguiente pregunta.'}
          </div>
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
