import axios from 'axios';

export default async function getToken(): Promise<string | undefined> {
  try {
    const options = {
      params: {
        command: 'request',
      },
    };

    const { data: { token } } = await axios.get(
      'https://opentdb.com/api_token.php',
      options,
    );

    return token;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ error, message: 'Could not retrieve session token' });
    return undefined;
  }
}

// export default { getToken };
