import { Router } from 'express';
import { protect, protectUserIDParam } from '../../tools/auth/protect';
import { createUserRealty, deleteOneRealty, getAllRealties, getOneRealty, updateOneRealty } from './handlers';

const router = Router();

router.get('/', getAllRealties);
router.post('/', protect, createUserRealty);
router.get('/:realtyId', getOneRealty);
router.put('/:realtyId', protectUserIDParam, updateOneRealty);
router.delete('/:realtyId', protectUserIDParam, deleteOneRealty);

export default router;
