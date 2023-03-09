import { Router } from 'express';
import { checkEmail } from '../../tools/auth/checkEmail';
import { protect } from '../../tools/auth/protect';
import { checkValidation } from '../../tools/validation';
import { getMe, sendCodeToEmail, signInUser, signUpUser } from './handlers';
import { signInValidation, signUpValidation, verifyValidation } from './validation';

const router = Router();

router.get('/me', protect, getMe);
router.post('/verify', checkEmail, verifyValidation, checkValidation, sendCodeToEmail);
router.post('/signup', checkEmail, signUpValidation, checkValidation, signUpUser);
router.post('/signin', signInValidation, checkValidation, signInUser);

export default router;
