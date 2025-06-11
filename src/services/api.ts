export interface UserResponse {
  success: string;
  message?: string;
  error?: string;
}

export async function createUser(name: string): Promise<UserResponse> {
  const res = await fetch("https://back.ego.quods.xyz/users", {
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
  const res = await fetch("https://back.ego.quods.xyz/room/create");
  if (!res.ok) throw new Error("No se pudo creaar la sala");
  const data = await res.json();
  console.log(data.room_id);
  return data.room_id;
}

export interface Card {
  id: number;
  text: string;
  room_id: string;
}

export async function selectBlackCards(roomId: string): Promise<Card[]> {
  const res = await fetch(`https://back.ego.quods.xyz/black_cards-select?room_id=${roomId}`);
  if (!res.ok) throw new Error("No se pudo seleccionar las cartas negras");
  const data = await res.json();

  if (data.success !== "1") {
    throw new Error(data.error || "Error al obtener cartas negras");
  }

  return data.black_cards;
}

export async function selectWhiteCards(roomId: string): Promise<Card[]> {
  const res = await fetch(`https://back.ego.quods.xyz/white_cards-select?room_id=${roomId}`);
  if (!res.ok) throw new Error("No se pudo seleccionar las cartas blancas");
  const data = await res.json();

  if (data.success !== "1") {
    throw new Error(data.error || "Error al obtener cartas blancas");
  }

  return data.white_cards;
}

export async function selectOneWhiteCard(roomId: string): Promise<Card> {
  const res = await fetch(`https://back.ego.quods.xyz/white_cards-one?room_id=${roomId}`);
  if (!res.ok) throw new Error("No se pudo seleccionar la carta blanca");
  const data = await res.json();

  if (data.success !== "1") {
    throw new Error(data.error || "Error al obtener carta blanca");
  }

  return data.white_cards;
}

interface GenerateCardsRequest {
  tema: string;
  room_id: string;
  prompt: string;
}

interface GenerateCardsResponse {
  success: string;
  message?: string;
  error?: string;
}

export async function generateCards(request: GenerateCardsRequest): Promise<GenerateCardsResponse> {
  const res = await fetch("https://back.ego.quods.xyz/generar-cartas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error al generar las cartas");
  }

  return data;
}

interface VerificarRespuestaRequest {
  white_card_id: number;
  black_card_id: number;
  room_id: string;
}

interface VerificarRespuestaResponse {
  success: string;
  es_correcta: boolean;
  white_card_id: number;
  black_card_id: number;
  room_id: string;
  error?: string;
}

export async function verificarRespuesta(request: VerificarRespuestaRequest): Promise<VerificarRespuestaResponse> {
  const res = await fetch("https://back.ego.quods.xyz/verificar-respuesta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error al verificar la respuesta");
  }

  return data;
}

interface CorrectCardsRequest {
  black_card_id: number;
  room_id: string;
}

interface CorrectCard extends Card {
  is_correct: boolean;
  black_card_id: number;
}

interface CorrectCardsResponse {
  success: string;
  correct_cards: CorrectCard[];
  black_card_id: number;
  room_id: string;
  count: number;
  error?: string;
}

export async function getCorrectCards(request: CorrectCardsRequest): Promise<CorrectCardsResponse> {
  const res = await fetch("https://back.ego.quods.xyz/correct-cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error al obtener las tarjetas correctas");
  }

  return data;
}