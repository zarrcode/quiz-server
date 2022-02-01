/* eslint-disable semi */
export default interface Options {
  params: {
    amount: number,
    token: string,
    type: 'multiple',
    category?: number,
    difficulty?: string,
  },
  headers: {
    accept: 'application/json',
  },
}
