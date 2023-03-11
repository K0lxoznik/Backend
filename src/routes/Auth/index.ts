import { Router } from 'express';
import { protect } from '../../tools/auth/protect';
import { checkValidation } from '../../tools/validation';
import { getMe, sendCodeToEmail, signInUser, signOutUser, signUpUser } from './handlers';
import { signInValidation, signUpValidation, verifyValidation } from './validation';

const router = Router();

router.get('/me', protect, getMe);
router.post('/signout', signOutUser);
router.post('/verify', verifyValidation, checkValidation, sendCodeToEmail);
router.post('/signup', signUpValidation, checkValidation, signUpUser);
router.post('/signin', signInValidation, checkValidation, signInUser);

export default router;
