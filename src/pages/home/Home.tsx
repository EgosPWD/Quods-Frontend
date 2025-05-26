import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "../../components/button/Button";
import { createRoom, createUser, generateCards } from "../../services/api";
import "./Home.css";

export default function Home(): React.ReactNode {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [character, setCharacter] = useState(1);
  const [fadeIn, setFadeIn] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [howToPlayStep, setHowToPlayStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  useEffect(() => {
    // delay de entrda solo es un efecto
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStartGame = async (): Promise<void> => {
    try {
      if (!nickname.trim()) {
        alert("Por favor ingresa un apodo");
        return;
      }
      
      if (!customPrompt.trim()) {
        alert("Por favor ingresa un tema o prompt para las cartas");
        return;
      }
      
      setIsLoading(true);
      
      await createUser(nickname);
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
      alert(err instanceof Error ? err.message : "Error al crear sala o registrar usuario");
      console.error("Error starting game:", err);
      setIsLoading(false);
    }
  };

  const regenerateCharacter = () => {
    setCharacter(prev => (prev % 4) + 1);
  };

  const howToPlayContent = [
    {
      title: "Crea una sala",
      description: "Elige tu personaje, ingresa un apodo y comienza el juego",
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#4ECDC4" />
        </svg>
      )
    },
    {
      title: "Invita amigos",
      description: "Comparte el enlace de la sala para que tus amigos se unan",
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="#FF6B6B" />
        </svg>
      )
    },
    {
      title: "¡Juega y diviértete!",
      description: "Completa frases con tus cartas y vota las más divertidas",
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11ZM8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="#FFE66D" />
        </svg>
      )
    }
  ];

  const nextStep = () => {
    setHowToPlayStep((prev) => (prev + 1) % howToPlayContent.length);
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
            <p className="subtitle">Un juego de completar frases con humor</p>
          </div>

          <div className="login-options">
            <div 
              className={`login-option ${activeTabIndex === 0 ? 'active' : ''}`} 
              onClick={() => setActiveTabIndex(0)}
            >
              Jugar Anónimo
            </div>
            <div 
              className={`login-option ${activeTabIndex === 1 ? 'active' : ''}`}
              onClick={() => setActiveTabIndex(1)}
            >
              Con Cuenta
            </div>
          </div>

          <div className="character-selection">
            <h2>ELIGE UN PERSONAJE<br />Y UN APODO</h2>

            <div className="character-container">
              <div className="character">
                <div className="logo">{character === 1 ? 'C' : character === 2 ? 'Q' : character === 3 ? 'H' : 'J'}</div>
              </div>
              <div className="character-refresh" onClick={regenerateCharacter}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="#111" />
                </svg>
              </div>
            </div>

            <input
              type="text"
              className="nickname-input"
              placeholder="Ingresa tu apodo..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            
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
          </div>

          <div className="buttonContainer">
            <Buttons
              variant="play"
              onClick={handleStartGame}
              disabled={isLoading}
            >
              {isLoading ? (
                "CREANDO JUEGO..."
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="white" />
                  </svg>
                  INICIAR JUEGO
                </>
              )}
            </Buttons>
          </div>
        </div>

        <div className="content-right">
          <div className="how-to-play">
            <h2>CÓMO JUGAR</h2>
            
            <div className="step">
              <div className="step-icon">
                {howToPlayContent[howToPlayStep].icon}
              </div>
              <h3>{howToPlayContent[howToPlayStep].title}</h3>
              <p>{howToPlayContent[howToPlayStep].description}</p>
            </div>
            
            <div className="pagination">
              {howToPlayContent.map((_, index) => (
                <div 
                  key={index} 
                  className={`dot ${index === howToPlayStep ? 'active' : ''}`} 
                  onClick={() => setHowToPlayStep(index)}
                />
              ))}
            </div>
            
            <div className="buttonContainer" style={{ marginTop: '20px' }}>
              <Buttons
                variant="secondary"
                onClick={nextStep}
              >
                Siguiente
              </Buttons>
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
