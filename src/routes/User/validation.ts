import { body } from 'express-validator';
import locales from '../../locales';
import { Language } from '../../types';

export const updateOneUserValidation = [
	body('email')
		.optional()
		.isEmail()
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_email),
	body('name')
		.optional()
		.isLength({ min: 2 })
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_name_length)
		.isString()
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_name_type),
	body('secondName')
		.optional()
		.isLength({ min: 2 })
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_secondName_length)
		.isString()
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_secondName_type),
];
