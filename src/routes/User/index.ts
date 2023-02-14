import { Router } from 'express';
import { protect, protectUserIDParam } from './../../tools/auth/protect';
import { changeUserData, deleteOneUser, getAllUsers, getOneUser } from './handlers';

const router = Router();

router.get('/', protect, getAllUsers);
router.get('/:id', protect, getOneUser);
router.delete('/:id', protectUserIDParam, deleteOneUser);
router.put('/:id', protectUserIDParam, changeUserData);

export default router;
