import { Router } from 'express';
import { DeleteOneUser, getAllUsers, getOneUser, ChangeUserData } from './handlers';

const router= Router();

// TODO:
// Защитить put и delete с помощью jwt protect

router.get('/all', getAllUsers);
router.get('/:id', getOneUser);
router.delete('/:id', DeleteOneUser);
router.put('/:id', ChangeUserData);

export default router;