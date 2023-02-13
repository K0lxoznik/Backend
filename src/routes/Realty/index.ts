import { getAllRealties, createUserRealty } from './handlers';
import { Router } from 'express';

const router = Router();

router.get('/all', getAllRealties);
router.post('/:userId', createUserRealty);

export default router;