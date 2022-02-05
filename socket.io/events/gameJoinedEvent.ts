import { type UserSocket } from '../interfaces';

export default function gameJoinedEvent(socket: UserSocket, gameTitle: string) {
  socket.emit('game_joined', gameTitle);
}
