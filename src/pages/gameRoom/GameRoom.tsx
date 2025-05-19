import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./GameRoom.css"; 

export default function GameRoom(): React.ReactNode {
  const { roomId } = useParams<{ roomId: string }>();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <p className="waiting-text">Esperando a que se unan los jugadores...</p>
        
        {isSmallScreen && (
          <button className="copy-btn mobile" onClick={() => navigator.clipboard.writeText(roomId || '')}>
            Copiar ID de sala
          </button>
        )}
      </div>
    </div>
  );
}
