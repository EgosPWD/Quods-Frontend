import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "../../components/button/Button";
import { createRoom, generateCards } from "../../services/api";
import "./Home.css";

export default function Home(): React.ReactNode {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [gameMode, setGameMode] = useState<'create' | 'join'>('create');
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    // delay de entrda solo es un efecto
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStartGame = async (): Promise<void> => {
    try {
      if (!customPrompt.trim()) {
        alert("Por favor ingresa un tema o prompt para las cartas");
        return;
      }
      
      setIsLoading(true);
      
      const roomId = await createRoom();
      
      // Generate cards for the room with custom prompt
      const promptText = customPrompt.trim();
      console.log(`Generando cartas para la sala ${roomId} con tema: ${promptText}`);
      await generateCards({ 
        tema: promptText, 
        room_id: roomId,
        prompt: promptText
      });
      
      navigate(`/room/${roomId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear sala");
      console.error("Error starting game:", err);
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (): Promise<void> => {
    try {
      if (!roomCode.trim()) {
        alert("Por favor ingresa el código de la sala");
        return;
      }
      
      setIsLoading(true);
      
      // Navigate to the room directly
      navigate(`/room/${roomCode.trim()}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al unirse a la sala");
      console.error("Error joining room:", err);
      setIsLoading(false);
    }
  };

  // Existing rooms data
  const existingRooms = [
    {
      id: "b38448ab-d492-40fc-9cd6-0f3c21026227",
      name: "Python sintaxis básica",
      theme: "python",
      color: "#4ECDC4"
    },
    {
      id: "4a8cf96b-6ccb-4663-8c36-e65c7bc43bae", 
      name: "Sistema circulatorio",
      theme: "biology",
      color: "#FF6B6B"
    },
    {
      id: "71eff5d5-8aa3-4034-9e79-78b357a5a2e9",
      name: "Sobre la primera guerra mundial fácil",
      theme: "history", 
      color: "#FFE66D"
    },
    {
      id: "864a2ea2-ef9a-4fce-a745-61a2a45ef7ca",
      name: "Sobre la sintaxis básica Java",
      theme: "java",
      color: "#A8E6CF"
    }
  ];

  const handleJoinExistingRoom = (roomId: string) => {
    setIsLoading(true);
    navigate(`/room/${roomId}`);
  };

  return (
    <div className={`homeContainer ${fadeIn ? 'fadeIn' : ''}`}>
      <div className="header">
        <div className="language-selector">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z" fill="#111" />
          </svg>
          <span>ES</span>
        </div>
        
        <div className="streamers">
          <div className="streamer">J</div>
          <div className="streamer">R</div>
          <div className="streamer">M</div>
        </div>
      </div>

      <div className="main-content">
        <div className="content-left">
          <div className="new-game-badge">
            <div className="badge">NUEVO</div>
          </div>

          <div className="game-logo">
            <h1 className="title">Cartas</h1>
            <p className="subtitle">Un juego para aprender</p>
          </div>

         

          <div className="character-selection">
            <h2>CREAR O UNIRSE A UNA SALA</h2>
            
            {/* Selector de modo de juego */}
            <div className="game-mode-selector" style={{ margin: '20px 0' }}>
              <div className="mode-tabs" style={{ 
                display: 'flex', 
                borderRadius: '8px', 
                overflow: 'hidden',
                border: '1px solid #ddd',
                backgroundColor: '#f5f5f5'
              }}>
                <button
                  className={`mode-tab ${gameMode === 'create' ? 'active' : ''}`}
                  onClick={() => setGameMode('create')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    backgroundColor: gameMode === 'create' ? '#4ECDC4' : 'transparent',
                    color: gameMode === 'create' ? 'white' : '#666',
                    fontWeight: gameMode === 'create' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Crear Nueva Sala
                </button>
                <button
                  className={`mode-tab ${gameMode === 'join' ? 'active' : ''}`}
                  onClick={() => setGameMode('join')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    backgroundColor: gameMode === 'join' ? '#4ECDC4' : 'transparent',
                    color: gameMode === 'join' ? 'white' : '#666',
                    fontWeight: gameMode === 'join' ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Unirse a Sala
                </button>
              </div>
            </div>
            
            {gameMode === 'create' ? (
              <div className="custom-prompt" style={{ marginTop: '15px' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>ELIGE EL TEMA DE LAS CARTAS</h3>
                <textarea
                  className="prompt-input"
                  placeholder="Ingresa el tema o instrucciones para generar cartas (por ejemplo: 'historia', 'deportes', 'ciencia ficción', etc.)..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>
            ) : (
              <div className="join-room" style={{ marginTop: '15px' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>CÓDIGO DE SALA</h3>
                <input
                  type="text"
                  className="room-code-input"
                  placeholder="Pega aquí el código de la sala..."
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '4px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    textAlign: 'center'
                  }}
                  required
                />
                <p style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginTop: '8px',
                  textAlign: 'center' 
                }}>
                  💡 Solicita el código de sala al creador del juego
                </p>
              </div>
            )}
          </div>

          <div className="buttonContainer">
            <Buttons
              variant="play"
              onClick={gameMode === 'create' ? handleStartGame : handleJoinRoom}
              disabled={isLoading}
            >
              {isLoading ? (
                gameMode === 'create' ? "CREANDO JUEGO..." : "UNIÉNDOSE..."
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {gameMode === 'create' ? (
                      <path d="M8 5V19L19 12L8 5Z" fill="white" />
                    ) : (
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="white" />
                    )}
                  </svg>
                  {gameMode === 'create' ? 'INICIAR JUEGO' : 'UNIRSE A SALA'}
                </>
              )}
            </Buttons>
          </div>
        </div>

        <div className="content-right">
          <div className="existing-rooms">
            <h2>SALAS EXISTENTES</h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              Únete a una sala que ya está en curso
            </p>
            
            <div className="rooms-list">
              {existingRooms.map((room) => (
                <div key={room.id} className="room-card" style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: '1px solid #e9ecef',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }} onClick={() => handleJoinExistingRoom(room.id)}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    backgroundColor: room.color
                  }}></div>
                  
                  <div style={{ marginLeft: '8px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      margin: '0 0 8px 0',
                      color: '#111',
                      fontWeight: '600'
                    }}>
                      {room.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        backgroundColor: room.color + '20',
                        color: room.color,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}>
                        {room.theme}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="#666" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px dashed #dee2e6'
            }}>
              <p style={{ 
                fontSize: '13px', 
                color: '#666', 
                margin: '0 0 8px 0' 
              }}>
                ¿No encuentras lo que buscas?
              </p>
              <button
                onClick={() => setGameMode('create')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4ECDC4',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Crea tu propia sala
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="footer-logo">
          <div className="logo mini">C</div>
        </div>

        <div className="footer-links">
          <a href="#">TÉRMINOS DE SERVICIO</a>
          <a href="#">PRIVACIDAD</a>
          <a href="#">CONTACTO</a>
        </div>

        <div className="footer-social">
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16 6 17.26 7.89 17.29C6.43 18.45 4.58 19.13 2.56 19.13C2.22 19.13 1.88 19.11 1.54 19.07C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z" fill="#111" />
            </svg>
          </a>
          <a href="#" className="social-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15L15.19 12L10 9V15ZM21.56 7.17C21.69 7.64 21.78 8.27 21.84 9.07C21.91 9.87 21.94 10.56 21.94 11.16L22 12C22 14.19 21.84 15.8 21.56 16.83C21.31 17.73 20.73 18.31 19.83 18.56C19.36 18.69 18.5 18.78 17.18 18.84C15.88 18.91 14.69 18.94 13.59 18.94L12 19C7.81 19 5.2 18.84 4.17 18.56C3.27 18.31 2.69 17.73 2.44 16.83C2.31 16.36 2.22 15.73 2.16 14.93C2.09 14.13 2.06 13.44 2.06 12.84L2 12C2 9.81 2.16 8.2 2.44 7.17C2.69 6.27 3.27 5.69 4.17 5.44C4.64 5.31 5.5 5.22 6.82 5.16C8.12 5.09 9.31 5.06 10.41 5.06L12 5C16.19 5 18.8 5.16 19.83 5.44C20.73 5.69 21.31 6.27 21.56 7.17Z" fill="#111" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
