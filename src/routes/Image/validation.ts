import { param } from 'express-validator';
import locales from '../../locales';
import { Language } from '../../types';

export const getOneImageValidation = [
	param('id')
		.exists()
		.withMessage((_, { req }) => locales[req.lang as Language].image.no_id)
		.isUUID()
		.withMessage((_, { req }) => locales[req.lang as Language].image.invalid_id),
];
