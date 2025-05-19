import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CardGame from "../../components/CardGame/CardGame";
import { Card } from "../../services/api";
import "./GameRoom.css"; 

export default function GameRoom(): React.ReactNode {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'completed'>('waiting');
  const [gameResults, setGameResults] = useState<{ round: number; blackCard: Card; whiteCard: Card }[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    
    const timer = setTimeout(() => {
      setGameState('playing');
    }, 3000);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleGameComplete = (results: { round: number; blackCard: Card; whiteCard: Card }[]) => {
    setGameResults(results);
    setGameState('completed');
  };

  const handlePlayAgain = () => {
    setGameState('waiting');
    setGameResults([]);
    
    setTimeout(() => {
      setGameState('playing');
    }, 2000);
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="game-room-container">
      <header className="game-header">
        <h1 className={isSmallScreen ? "h4" : "h3"}>Sala de juego</h1>
        <div className="room-info">
          <strong>ID de la sala:</strong> <span className="room-id">{roomId}</span>
          {!isSmallScreen && (
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(roomId || '')}>
              Copiar
            </button>
          )}
        </div>
      </header>

      <div className="game-content">
        {gameState === 'waiting' && (
          <div className="waiting-container">
            <p className="waiting-text">Esperando a que se unan los jugadores...</p>
            
            {isSmallScreen && (
              <button className="copy-btn mobile" onClick={() => navigator.clipboard.writeText(roomId || '')}>
                Copiar ID de sala
              </button>
            )}
          </div>
        )}
        
        {gameState === 'playing' && (
          <CardGame onGameComplete={handleGameComplete} />
        )}
        
        {gameState === 'completed' && (
          <div className="game-results">
            <h2>Resultados del juego</h2>
            
            <div className="results-container">
              {gameResults.map((result) => (
                <div key={result.round} className="round-result">
                  <h3>Ronda {result.round}</h3>
                  <div className="cards-combination">
                    <div className="result-black-card">
                      <p>{result.blackCard.text}</p>
                    </div>
                    <div className="result-white-card">
                      <p>{result.whiteCard.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="action-buttons">
              <button className="play-again-btn" onClick={handlePlayAgain}>
                Jugar otra vez
              </button>
              <button className="home-btn" onClick={handleReturnHome}>
                Volver al inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
