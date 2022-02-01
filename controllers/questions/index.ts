import axios from 'axios';

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
    const options = {
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
    if (category) options.params[category] = category;
    if (difficulty) options.params[difficulty] = difficulty;
    if (type) options.params[type] = type;

    const { data: { results } } = await axios.get(
      'https://opentdb.com/api.php',
      options,
    );

    const resultsArray: string[] = [];

    if (type && type === 'multiple') {
      results.every((el) => {
        if (el.question.includes('Which of')) return true;
        resultsArray.push(el.question);
        resultsArray.push(el.correct_answer);
        resultsArray.push(...el.incorrect_answers);
        if (resultsArray.length === amount * 5) return false;
        return true;
      });
    } else {
      results.every((el) => {
        if (el.question.includes('Which of')) return true;
        resultsArray.push(el.question);
        resultsArray.push(el.correct_answer);
        if (resultsArray.length === amount * 2) return false;
        return true;
      });
    }


    return results;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error, message: 'Could not retrieve questions' });
    return undefined;
  }
}

getQuestions(10, 'a1990082e37ccecb266d6dd65f3bf5ba82577539616c0d042971e2002a48a346', 9, 'easy', 'multiple');

export default { getQuestions };
