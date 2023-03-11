import { Router } from 'express';
import { checkValidation } from './../../tools/validation/index';
import { getOneImage } from './handlers';
import { getOneImageValidation } from './validation';

const router = Router();

router.get('/:id', getOneImageValidation, checkValidation, getOneImage);

export default router;
