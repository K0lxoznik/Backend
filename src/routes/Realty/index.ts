import { Router } from 'express';
import { protect } from '../../tools/auth/protect';
import { protectRealtyIDParam } from './../../tools/auth/protect';
import { checkValidation } from './../../tools/validation/index';
import {
	addRealtyToFavorite,
	createUserRealty,
	deleteOneRealty,
	getAllRealties,
	getFavoriteRealties,
	getMyRealties,
	getOneRealty,
	removeRealtyFromFavorite,
	updateOneRealty,
	updateRealtyViews,
} from './handlers';
import { createUserRealtyValidation, updateOneRealtyValidation } from './validation';

const router = Router();

router.get('/', getAllRealties);
router.post('/view/:id([0-9]+)', protect, updateRealtyViews);
router.post('/favorite/:realtyId([0-9]+)', protect, addRealtyToFavorite);
router.get('/favorite', protect, getFavoriteRealties);
router.get('/me', protect, getMyRealties);
router.delete('/favorite/:realtyId([0-9]+)', protect, removeRealtyFromFavorite);
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
