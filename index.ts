import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import serverPort from './environment';
import router from './router';
import initSocketIO from './socket.io';

const app = express();
const corsConfig = { origin: 'https://next-quiz.herokuapp.com', credentials: true };

app
  .use(cors(corsConfig))
  .use(express.json())
  .use(router)
  .get('*', (req: Request, res: Response) => {
    res.status(404).send('404 Page not found');
  });

const server = http.createServer(app);

initSocketIO(server);

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${serverPort}`);
});
