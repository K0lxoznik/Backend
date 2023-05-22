import { body } from 'express-validator';
import locales from '../../locales';
import { Language } from '../../types';

export const updateOneUserValidation = [
	body('email')
		.isEmail()
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_email),
	body('name')
		.isLength({ min: 2 })
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_name_length)
		.isString()
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_name_type),
	body('secondName')
		.isLength({ min: 2 })
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_secondName_length)
		.isString()
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_secondName_type),
];

export const verifyUserCodeValidation = [
	body('code')
		.isNumeric()
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_code)
		.isLength({
			min: 6,
			max: 6,
		})
		.withMessage((_, { req }) => locales[req.lang as Language].user.invalid_code),
];
