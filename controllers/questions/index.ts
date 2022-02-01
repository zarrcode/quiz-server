import axios from 'axios';
import Questions from '../../interfaces/Questions';
import Options from '../../interfaces/Options';

async function getQuestions(
  amount: number,
  token: string,
  category?: number,
  difficulty?: string,
  type?: string,
): Promise<string | undefined> {
  // eslint-disable-next-line no-console
  console.log('Making a request to Open Trivia DB');

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
    console.log(resultsArray);
    console.log(resultsArray.length);

    return results;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error, message: 'Could not retrieve questions' });
    return undefined;
  }
}

getQuestions(10, '6c153b1dfbfdd345b8f1398dafda289442073cd6243c709cf69574abe4f92e9c', 9, 'easy', 'multiple');

export default { getQuestions };
