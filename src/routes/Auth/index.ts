import { validateEmail } from './../../tools/auth/validateEmail';
import { Router } from 'express';
import { signInUser, signUpUser, sendCodeToEmail } from './handlers';
import { body } from 'express-validator';

const router = Router();

router.post(
	'/verify',
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
