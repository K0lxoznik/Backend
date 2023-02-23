import { validateEmail } from './../../tools/auth/validateEmail';
import { Router } from 'express';
import { signInUser, signUpUser, sendCodeToEmail } from './handlers';

const router = Router();

router.post('/verify', validateEmail, sendCodeToEmail);
router.post('/signup', validateEmail, signUpUser);
router.post('/signin', signInUser);

export default router;
