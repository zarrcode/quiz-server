import { type UserSocket } from '../interfaces';
import { findSession } from '../../models/users';

export default async function userDataEvent(socket: UserSocket) {
  const session = await findSession(socket.sessionID!);
  if (session) {
    const userData = {
      username: session.username,
      gameID: session.gameID,
    };
    socket.emit('user_data', userData);
  }
}
