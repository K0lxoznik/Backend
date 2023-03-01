import { body } from 'express-validator';
import { Router } from 'express';
import { protect, protectUserIDParam } from './../../tools/auth/protect';
import { deleteOneUser, getAllUsers, getOneUser, updateOneUser } from './handlers';

const router = Router();

router.get('/', protect, getAllUsers);
router.get('/:id([0-9]+)', protect, getOneUser);
router.delete('/:id([0-9]+)', protectUserIDParam, deleteOneUser);
router.put(
	'/:id([0-9]+)',
	body('name').isLength({ min: 2, max: 20 }).optional().not().matches(/^\D+$/),
	body('secondName').isLength({ min: 2, max: 20 }).optional().not().matches(/^\D+$/),
	body('bio').isLength({ max: 200 }).optional(),
	protectUserIDParam,
	updateOneUser,
);

export default router;
