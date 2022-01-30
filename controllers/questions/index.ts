import { Request, Response } from 'express';
import axios from 'axios';

async function getQuestions(req: Request, res: Response): Promise<void> {
  const {
    questionAmount,
    questionDifficulty,
    questionType,
    questionToken,
  } = JSON.parse(req.body);

  // eslint-disable-next-line no-console
  console.log('Making a request to Open Trivia DB');

  try {
    const options = {
      params: {
        amount: questionAmount,
        difficulty: questionDifficulty,
        type: questionType,
        token: questionToken,
      },
    };

    const { data: { results } } = await axios.get(
      'http://opentdb.com/api/.php',
      options,
    );

    res.json(results);
  } catch (error) {
    res.status(500).send({ error, message: 'Could not retrieve questions' });
  }
}

export default { getQuestions };
