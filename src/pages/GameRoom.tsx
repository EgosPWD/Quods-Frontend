import { useParams } from "react-router-dom";

export default function GameRoom(): React.ReactNode {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <div className="container py-5">
      <h1 className="h3">Sala de juego</h1>
      <p>
        <strong>ID de la sala:</strong> {roomId}
      </p>

      {/*logica espera para terminar*/}
      <p className="text-muted">Esperando a que se unan los jugadores...</p>
    </div>
  );
}
