import { Router } from 'express';
import { protect, protectUserIDParam } from './../../tools/auth/protect';
import { checkValidation } from './../../tools/validation/index';
import {
	deleteOneUser,
	getAllUsers,
	getOneUser,
	resendCode,
	updateOneUser,
	verifyUserCode,
} from './handlers';
import { updateOneUserValidation, verifyUserCodeValidation } from './validation';

const router = Router();

router.get('/', protect, getAllUsers);
router.get('/:id([0-9]+)', getOneUser);
router.post('/verify', protect, verifyUserCodeValidation, checkValidation, verifyUserCode);
router.post('/resend-verify', protect, resendCode);
router.delete('/:id([0-9]+)', protectUserIDParam, deleteOneUser);
router.put(
	'/:id([0-9]+)',
	protectUserIDParam,
	updateOneUserValidation,
	checkValidation,
	updateOneUser,
);

export default router;
