export async function createRoom(): Promise<string> {
  const res = await fetch("http://localhost:8000/room/create");
  if (!res.ok) throw new Error("No se pudo creaar la sala");
  const data = await res.json();
  console.log(data.room_id);
  return data.room_id;
}

export async function SelectBlackCards(): Promise<string[]> {
  const res = await fetch("http://localhost:8000/room/select_black-cards");
  if (!res.ok) throw new Error("No se pudo seleccionar las cartas negras");
  const data = await res.json();
  console.log(data.black_cards);
  return data.black_cards;


}

export async function SelectWhiteCards(): Promise<string[]> {
  const res = await fetch("http://localhost:8000/room/select_white-cards");
  if (!res.ok) throw new Error("No se pudo seleccionar las cartas blancas");
  const data = await res.json();
  console.log(data.white_cards);
  return data.white_cards;
} 