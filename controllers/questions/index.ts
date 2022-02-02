import axios from 'axios';
import Questions from '../../interfaces/Questions';
import Options from '../../interfaces/Options';

export default async function getQuestions(
  amount: number,
  token: string,
  category?: number,
  difficulty?: string,
  type?: string,
): Promise<string[] | undefined> {
  // eslint-disable-next-line no-console
  console.log('Making a request to Open Trivia DB');
  console.log(amount, token, category, difficulty, type);

  try {
    const options: Options = {
      params: {
        amount: amount + 10,
        token,
        type: 'multiple',
      },
      headers: {
        accept: 'application/json',
      },
    };

    // initialising optional parameters
    if (category) options.params.category = category;
    if (difficulty) options.params.difficulty = difficulty;

    const { data: { results } } = await axios.get(
      'https://opentdb.com/api.php',
      options,
    );
    // console.log('options',options)

    const resultsArray: string[] = [];

    if (type && type === 'multiple') {
      results.every((el: Questions) => {
        if (el.question.includes('Which of')) return true;
        resultsArray.push(el.question);
        resultsArray.push(el.correct_answer);
        resultsArray.push(...el.incorrect_answers);
        if (resultsArray.length === amount * 5) return false;
        return true;
      });
    } else {
      results.every((el: Questions) => {
        if (el.question.includes('Which of')) return true;
        resultsArray.push(el.question);
        resultsArray.push(el.correct_answer);
        if (resultsArray.length === amount * 2) return false;
        return true;
      });
    }
    // console.log('resultsarray',resultsArray);
    // console.log(resultsArray.length);

    return resultsArray;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error, message: 'Could not retrieve questions' });
    return undefined;
  }
}

getQuestions(10, '4e71392db0f4da3de01427dc87a465e64756964937c0af5ed68b2bcc5a466b80', 9, 'easy', 'multiple');

// export default { getQuestions };
