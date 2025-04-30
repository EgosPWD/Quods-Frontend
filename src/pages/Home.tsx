import React from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "../components/button/Button";
import { createRoom } from "../services/api";

export default function Home(): React.ReactNode {
  const navigate = useNavigate();

  const handleStartGame = async (): Promise<void> => {
    try {
      const roomId = await createRoom();
      navigate(`/room/${roomId}`);
    } catch (err) {
      alert("Error al crear sala");
      console.error(err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="text-center bg-white p-10 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-6">Cartas</h1>
        <p className="mb-4 text-lg">Un juego de completar frases con humor</p>
        <Buttons onClick={handleStartGame} variant="primary">
          Iniciar Juego
        </Buttons>
      </div>
    </div>
  );
}
