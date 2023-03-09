import { Router } from 'express';
import { protect } from '../../tools/auth/protect';
import { protectRealtyIDParam } from './../../tools/auth/protect';
import { checkValidation } from './../../tools/validation/index';
import {
	createUserRealty,
	deleteOneRealty,
	getAllRealties,
	getOneRealty,
	updateOneRealty,
} from './handlers';
import { createUserRealtyValidation, updateOneRealtyValidation } from './validation';

const router = Router();

router.get('/', getAllRealties);
router.post('/', protect, createUserRealtyValidation, checkValidation, createUserRealty);
router.get('/:id([0-9]+)', getOneRealty);
router.put(
	'/:id([0-9]+)',
	protectRealtyIDParam,
	updateOneRealtyValidation,
	checkValidation,
	updateOneRealty,
);
router.delete('/:id([0-9]+)', protectRealtyIDParam, deleteOneRealty);

export default router;
