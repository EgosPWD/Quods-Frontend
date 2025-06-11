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
  const [gameResults, setGameResults] = useState<{ round: number; blackCard: Card; whiteCard: Card; isCorrect?: boolean }[]>([]);
  const [tema, setTema] = useState<string>(""); 

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    if (roomId) {
      const timer = setTimeout(() => {
        setGameState('playing');
      }, 3000);
      
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timer);
      };
    } else {
      navigate('/');
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [roomId, navigate]);

  const handleGameComplete = (results: { round: number; blackCard: Card; whiteCard: Card; isCorrect?: boolean }[]) => {
    setGameResults(results);
    setGameState('completed');
    
    if (results.length > 0 && results[0].blackCard.room_id) {
      const cardRoomId = results[0].blackCard.room_id;
      const themeParts = cardRoomId.split('-');
      if (themeParts.length > 0) {
        setTema(themeParts[0].charAt(0).toUpperCase() + themeParts[0].slice(1));
      }
    }
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
        {tema && (
          <div className="game-theme" style={{ 
            fontSize: isSmallScreen ? '14px' : '16px',
            backgroundColor: '#f0f0f0', 
            padding: '5px 10px', 
            borderRadius: '4px',
            display: 'inline-block',
            margin: '5px 0'
          }}>
            Tema: {tema}
          </div>
        )}
      </header>

      <div className="game-content">
        {gameState === 'waiting' && (
          <div className="waiting-container">
            <p className="waiting-text">Esperando a que se unan los jugadores...</p>
            
            {/* Código de sala en estado waiting */}
            <div className="room-code-section waiting" style={{
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6',
              borderRadius: '8px',
              padding: '20px',
              margin: '20px auto',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#495057' }}>
                Código de Sala
              </h3>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#212529',
                backgroundColor: 'white',
                padding: '10px 20px',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                margin: '10px 0',
                letterSpacing: '2px',
                fontFamily: 'monospace'
              }}>
                {roomId}
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(roomId || '');
                  const btn = document.querySelector('.waiting .copy-btn-main') as HTMLButtonElement;
                  const originalText = btn.textContent;
                  btn.textContent = '¡Copiado!';
                  btn.style.backgroundColor = '#28a745';
                  setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '#007bff';
                  }, 2000);
                }}
                className="copy-btn-main"
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                📋 Copiar Código
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && roomId && (
          <div className="playing-layout">
            {/* Código de sala flotante durante el juego */}
            <div className="room-code-floating">
              <div className="room-code-compact">
                <span className="code-label">Sala:</span>
                <span className="code-value">{roomId}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(roomId || '');
                    const btn = document.querySelector('.copy-icon-floating') as HTMLButtonElement;
                    const originalText = btn.textContent;
                    btn.textContent = '✓';
                    setTimeout(() => {
                      btn.textContent = originalText;
                    }, 1500);
                  }}
                  className="copy-icon-floating"
                  title="Copiar código"
                >
                  📋
                </button>
              </div>
            </div>
            <CardGame onGameComplete={handleGameComplete} roomId={roomId} />
          </div>
        )}

        {gameState === 'completed' && (
          <div className="game-results">
            <h2>Resultados del juego</h2>

            <div className="results-summary" style={{ marginBottom: '20px' }}>
              <div className="summary-stats" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px',
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div className="stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {gameResults.length}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Total de respuestas</div>
                </div>
                <div className="stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                    {gameResults.filter(r => r.isCorrect === true).length}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Correctas</div>
                </div>
                <div className="stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                    {gameResults.filter(r => r.isCorrect === false).length}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Incorrectas</div>
                </div>
              </div>
              
              <div style={{ 
                padding: '10px 15px', 
                backgroundColor: gameResults.filter(r => r.isCorrect === true).length > gameResults.filter(r => r.isCorrect === false).length ? '#d4edda' : '#f8d7da',
                borderRadius: '4px',
                marginBottom: '30px',
                textAlign: 'center',
                color: gameResults.filter(r => r.isCorrect === true).length > gameResults.filter(r => r.isCorrect === false).length ? '#155724' : '#721c24'
              }}>
                {gameResults.filter(r => r.isCorrect === true).length > gameResults.filter(r => r.isCorrect === false).length
                  ? '¡Felicidades! Has tenido más respuestas correctas que incorrectas. 🎉'
                  : 'Puedes mejorar. ¡Intenta nuevamente para conseguir más respuestas correctas! 💪'
                }
              </div>
            </div>
            
            <div className="results-container">
              {gameResults.map((result) => (
                <div key={result.round} className="round-result">
                  <h3>Ronda {result.round}</h3>
                  <div className="cards-combination">
                    <div className="result-black-card">
                      <p>{result.blackCard.text}</p>
                    </div>
                    <div 
                      className={`result-white-card ${
                        result.isCorrect !== undefined ? 
                          (result.isCorrect ? 'correct' : 'incorrect') : 
                          ''
                      }`}
                      style={{
                        position: 'relative',
                        borderLeft: result.isCorrect !== undefined ? 
                          `4px solid ${result.isCorrect ? '#28a745' : '#dc3545'}` : 
                          'none'
                      }}
                    >
                      <p>{result.whiteCard.text}</p>
                      {result.isCorrect !== undefined && (
                        <div 
                          className="verification-badge"
                          style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: result.isCorrect ? '#28a745' : '#dc3545',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        >
                          {result.isCorrect ? '✓' : '✗'}
                        </div>
                      )}
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
