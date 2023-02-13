import { Router } from 'express';
import { deleteOneUser, getAllUsers, getOneUser, changeUserData } from './handlers';

const router= Router();

router.get('/all', getAllUsers);
router.get('/:id', getOneUser);
router.delete('/:id', deleteOneUser);
router.put('/:id', changeUserData);

export default router;