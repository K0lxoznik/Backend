import { validateRealtyCreation, validateRealtyUpdation } from './../../tools/realty/checkRealty';
import { protectRealtyIDParam } from './../../tools/auth/protect';
import { Router } from 'express';
import { protect, protectUserIDParam } from '../../tools/auth/protect';
import {
	createUserRealty,
	deleteOneRealty,
	getAllRealties,
	getOneRealty,
	updateOneRealty,
} from './handlers';

const router = Router();

router.get('/', getAllRealties);
router.post('/', ...validateRealtyCreation, protect, createUserRealty);
router.get('/:id([0-9]+)', getOneRealty);
router.put('/:id([0-9]+)', ...validateRealtyUpdation, protectRealtyIDParam, updateOneRealty);
router.delete('/:id([0-9]+)', protectUserIDParam, deleteOneRealty);

export default router;
