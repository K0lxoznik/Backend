import { protect } from './../../tools/auth/protect';
import { getCity } from './handlers';
import { Router } from 'express';

const router = Router();

router.get('/', protect, getCity);

export default router;
