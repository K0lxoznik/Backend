import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../../tools/auth/protect';
import { checkLanguage } from '../../tools/auth/validateLanguage';
import { validateEmail } from './../../tools/auth/validateEmail';
import { getMe, sendCodeToEmail, signInUser, signUpUser } from './handlers';

const router = Router();

router.get('/me', protect, getMe);

router.post(
	'/verify',
	checkLanguage,
	body('email').isEmail(),
	body('password').isLength({ min: 8 }),
	validateEmail,
	sendCodeToEmail,
);

router.post(
	'/signup',
	body('email').isEmail(),
	body('password').isLength({ min: 8 }),
	body('code').isNumeric().isLength({ min: 6 }),
	validateEmail,
	signUpUser,
);

router.post('/signin', body('email').isEmail(), body('password').isLength({ min: 8 }), signInUser);

export default router;
