import axios from 'axios';
import Questions from '../../interfaces/Questions';
import Options from '../../interfaces/Options';
import categories from './categories';

async function getCategory(
  amount: number,
  token: string,
  category?: string,
  difficulty?: string,
  type?: string,
): Promise<string[] | undefined> {
  // eslint-disable-next-line no-console
  console.log('Making a request to Open Trivia DB');

  try {
    const options: Options = {
      params: {
        amount,
        token,
        type: 'multiple',
      },
      headers: {
        accept: 'application/json',
      },
    };

    const resultsArray: string[] = [];

    // initialising optional parameters
    if (category && categories[category]) options.params.category = categories[category];
    if (difficulty) options.params.difficulty = difficulty;

    const { data: { results } } = await axios.get(
      'https://opentdb.com/api.php',
      options,
    );

    if (type && type === 'multiple') {
      results.every((el: Questions) => {
        if (el.question.includes('Which of')) return true;
        resultsArray.push(el.question);
        resultsArray.push(el.correct_answer);
        resultsArray.push(...el.incorrect_answers);
        return true;
      });
    } else {
      results.every((el: Questions) => {
        if (el.question.includes('Which of')) return true;
        resultsArray.push(el.question);
        resultsArray.push(el.correct_answer);
        return true;
      });
    }
    return resultsArray;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error, message: 'Could not retrieve questions' });
    return undefined;
  }
}

export default async function getQuestions(
  amount: number,
  token: string,
  category: string[],
  difficulty?: string,
  type?: string,
): Promise<string [] | undefined> {
  try {
    let categoryAmount;
    if (category.length) categoryAmount = Math.floor(amount / category.length);
    else {
      const resultsArray = await getCategory(amount, token, undefined, difficulty, type);
      return resultsArray;
    }
    const questionArray: string[] = [];
    for (let i = 0; i < category.length; i += 1) {
      while (categoryAmount > 0) {
        // eslint-disable-next-line no-await-in-loop
        const resultsArray = await getCategory(
          categoryAmount,
          token,
          category[i],
          difficulty,
          type,
        );
        if (resultsArray) categoryAmount -= resultsArray.length;
        questionArray.push(...resultsArray!);
      }
      categoryAmount = Math.floor(amount / category.length);
    }
    console.log(questionArray);
    console.log(questionArray.length);
    return questionArray;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error, message: 'Could not retrieve questions' });
    return undefined;
  }
}

getQuestions(3, '7001d370f44e8e10960558866995e4ed21f12362baa5ff50425dcffd697e3d2b', ['Video Games', 'Politics', 'Sports'], 'easy', 'multiple');
