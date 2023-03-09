import { Router } from 'express';
import { protect, protectUserIDParam } from './../../tools/auth/protect';
import { checkValidation } from './../../tools/validation/index';
import { updateOneRealtyValidation } from './../Realty/validation';
import { deleteOneUser, getAllUsers, getOneUser, updateOneUser } from './handlers';

const router = Router();

router.get('/', protect, getAllUsers);
router.get('/:id([0-9]+)', protect, getOneUser);
router.delete('/:id([0-9]+)', protectUserIDParam, deleteOneUser);
router.put(
	'/:id([0-9]+)',
	protectUserIDParam,
	updateOneRealtyValidation,
	checkValidation,
	updateOneUser,
);

export default router;
