import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:8000', { autoConnect: false });
  }
  return socket;
}

export function connectToRoom(roomId: string, playerName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = getSocket();
    socket.connect();
    
    socket.emit('join-room', { roomId, playerName }, (response: { success: boolean, error?: string }) => {
      if (response.success) {
        resolve();
      } else {
        reject(new Error(response.error || 'Failed to join room'));
      }
    });
    
    socket.on('connect_error', (error) => {
      reject(error);
    });
  });
}

export function disconnectFromRoom(): void {
  const socket = getSocket();
  if (socket.connected) {
    socket.disconnect();
  }
}