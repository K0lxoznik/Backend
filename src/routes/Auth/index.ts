import { Router } from 'express';
import { signInUser, signUpUser } from './handlers';

const router = Router();

router.post('/signup', signUpUser);
router.post('/signin', signInUser);

export default router;
