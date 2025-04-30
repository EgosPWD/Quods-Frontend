export async function createRoom(): Promise<string> {
  const res = await fetch("http://localhost:8000/room/create");
  if (!res.ok) throw new Error("No se pudo crear la sala");
  const data = await res.json();
  console.log(data.room_id);
  return data.room_id;
}
