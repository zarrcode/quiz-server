import { Request, Response } from 'express';
import axios from 'axios';

async function getToken(_: Request, res: Response): Promise<void> {
  try {
    const options = {
      params: {
        command: 'request',
      },
    };

    const { data: { token } } = await axios.get(
      'http://opentdb.com/api_token.php',
      options,
    );
    res.json(token);
  } catch (error) {
    res.status(500).send({ error, message: 'Could not retrieve session token' });
  }
}

export default { getToken };
