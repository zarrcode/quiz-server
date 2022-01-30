import express, { Request, Response } from 'express';
import cors from 'cors';
import serverPort from './environment';
import router from './router';

const app = express();
const corsConfig = { origin: 'http://localhost:3000', credentials: true };

app
  .use(cors(corsConfig))
  .use(express.json())
  .use(router)
  .get('*', (req: Request, res: Response) => {
    res.status(404).send('404 Page not found');
  })
  // eslint-disable-next-line no-console
  .listen(serverPort, () => console.log(`Server running at http://localhost:${serverPort}`));
