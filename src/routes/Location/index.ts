import { getCity } from './handlers';
import { Router } from 'express';

const router = Router();

router.get('/', getCity);

export default router;