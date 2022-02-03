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
    let amountModifier;
    if (type && type === 'multiple') amountModifier = 5;
    else amountModifier = 2;
    while (questionArray.length < amount * amountModifier) {
      for (let i = 0; i < category.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const resultsArray = await getCategory(1, token, category[i], difficulty, type);
        if (resultsArray && resultsArray.length) {
          questionArray.push(...resultsArray);
          if (questionArray.length === amount * amountModifier) break;
        }
      }
    }
    return questionArray;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error, message: 'Could not retrieve questions' });
    return undefined;
  }
}
