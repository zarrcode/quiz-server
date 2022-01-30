import { Router } from 'express';
import token from './controllers/token';
import questions from './controllers/questions';

const router = Router();

router
  .get('/token', token.getToken)
  .get('/questions', questions.getQuestions);

export default router;
