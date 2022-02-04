import { type Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { clientURL } from '../environment';
import initMiddleware from './middleware';
import initListeners from './listeners';

export default function initSocketIO(server: HttpServer) {
  const io = new SocketServer(server, {
    cors: { origin: clientURL },
  });

  initMiddleware(io);
  initListeners(io);
}
