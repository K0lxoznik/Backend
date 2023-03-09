import { Router } from 'express';
import { protect } from './../../tools/auth/protect';
import { getCity } from './handlers';

const router = Router();

router.get('/', protect, getCity);

export default router;
