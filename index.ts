import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import serverPort, { clientURL } from './environment';
import router from './router';
import { addMiddleware } from './socket.io/middleware';
import { addServerListeners } from './socket.io/serverListeners';

const app = express();
const corsConfig = { origin: 'http://localhost:3000', credentials: true };

app
  .use(cors(corsConfig))
  .use(express.json())
  .use(router)
  .get('*', (req: Request, res: Response) => {
    res.status(404).send('404 Page not found');
  });

// add socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: clientURL },
});
// configure socket server
addMiddleware(io);
addServerListeners(io);

// eslint-disable-next-line no-console
server.listen(serverPort, () => console.log(`Server running at http://localhost:${serverPort}`));
