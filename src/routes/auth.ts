import { signUpUser, signInUser } from './user';
import { Router } from 'express';


const router = Router();

router.post('/signin', signInUser);

router.post('/signup', signUpUser);

export default router;
