export interface UserResponse {
  success: string;
  message?: string;
  error?: string;
}

export async function createUser(name: string): Promise<UserResponse> {
  const res = await fetch("http://localhost:8000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || "Error al crear usuario");
  }
  
  return data;
}

export async function createRoom(): Promise<string> {
  const res = await fetch("http://localhost:8000/room/create");
  if (!res.ok) throw new Error("No se pudo creaar la sala");
  const data = await res.json();
  console.log(data.room_id);
  return data.room_id;
}

export interface Card {
  id: number;
  text: string;
}

export async function selectBlackCards(): Promise<Card[]> {
  const res = await fetch("http://localhost:8000/black_cards-select");
  if (!res.ok) throw new Error("No se pudo seleccionar las cartas negras");
  const data = await res.json();
  
  if (data.success !== "1") {
    throw new Error(data.error || "Error al obtener cartas negras");
  }
  
  return data.black_cards;
}

export async function selectWhiteCards(): Promise<Card[]> {
  const res = await fetch("http://localhost:8000/white_cards-select");
  if (!res.ok) throw new Error("No se pudo seleccionar las cartas blancas");
  const data = await res.json();
  
  if (data.success !== "1") {
    throw new Error(data.error || "Error al obtener cartas blancas");
  }
  
  return data.white_cards;
}

export async function selectOneWhiteCard(): Promise<Card> {
  const res = await fetch("http://localhost:8000/white_cards-one");
  if (!res.ok) throw new Error("No se pudo seleccionar la carta blanca");
  const data = await res.json();
  
  if (data.success !== "1") {
    throw new Error(data.error || "Error al obtener carta blanca");
  }
  
  // The endpoint returns an object with a single card, not an array
  return data.white_cards;
} 