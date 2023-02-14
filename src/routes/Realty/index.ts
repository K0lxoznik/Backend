import { protectRealtyIDParam } from './../../tools/auth/protect';
import { Router } from 'express';
import { protect, protectUserIDParam } from '../../tools/auth/protect';
import { createUserRealty, deleteOneRealty, getAllRealties, getOneRealty, updateOneRealty } from './handlers';

const router = Router();

router.get('/', getAllRealties);
router.post('/', protect, createUserRealty);
router.get('/:id', getOneRealty);
router.put('/:id', protectRealtyIDParam, updateOneRealty);
router.delete('/:id', protectUserIDParam, deleteOneRealty);

export default router;
