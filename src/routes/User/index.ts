import { Router } from 'express';
import { protect, protectUserIDParam } from './../../tools/auth/protect';
import { deleteOneUser, getAllUsers, getOneUser, updateOneUser } from './handlers';

const router = Router();

router.get('/', protect, getAllUsers);
router.get('/:id', protect, getOneUser);
router.delete('/:id', protectUserIDParam, deleteOneUser);
router.put('/:id', protectUserIDParam, updateOneUser);

export default router;
