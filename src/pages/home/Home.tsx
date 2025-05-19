import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "../../components/button/Button";
import { createRoom, createUser } from "../../services/api";
import "./Home.css";

export default function Home(): React.ReactNode {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [character, setCharacter] = useState(1);

  const handleStartGame = async (): Promise<void> => {
    try {

      // Validar que haya ingresado un apodo
      if (!nickname.trim()) {
        alert("Por favor ingresa un apodo");
        return;
      }

      await createUser(nickname);

      const roomId = await createRoom();

      navigate(`/room/${roomId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear sala o registrar usuario");
      console.error(err);
    }
  };

  const regenerateCharacter = () => {
    setCharacter(prev => (prev % 4) + 1);
  };

  return (
    <div className="homeContainer">
      <div className="header">


      </div>

      <div className="main-content">
        <div className="content-left">
          <div className="new-game-badge">

          </div>

          <div className="game-logo">
            <h1 className="title">Cartas</h1>
            <p className="subtitle">Un juego de completar frases con humor</p>
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
              placeholder="Apolo"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div className="buttonContainer">
            <Buttons
              variant="play"
              onClick={handleStartGame}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="white" />
              </svg>
              INICIAR JUEGO
            </Buttons>
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
