import { type UserSocket } from '../interfaces';

export default function anyHandler(socket: UserSocket) {
  socket.onAny((event, ...args) => console.log(event, ...args));
}
