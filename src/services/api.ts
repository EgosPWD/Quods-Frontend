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