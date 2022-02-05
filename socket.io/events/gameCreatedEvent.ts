import { type UserSocket } from '../interfaces';

export default function gameCreatedEvent(socket: UserSocket, gameID: string) {
  socket.emit('game_created', gameID);
}
