import { body } from 'express-validator';
import locales from '../../locales';
import { Language } from '../../types';

export const verifyValidation = [
	body('email')
		.isEmail()
		.withMessage((_, { req }) => locales[req.lang as Language].auth.invalid_email),
	body('password')
		.isLength({ min: 8 })
		.withMessage((_, { req }) => locales[req.lang as Language].auth.invalid_password),
	body('name')
		.isLength({ min: 2 })
		.withMessage((_, { req }) => locales[req.lang as Language].auth.invalid_name_length)
		.isString()
		.withMessage((_, { req }) => locales[req.lang as Language].auth.invalid_name_type),
	body('secondName')
		.isLength({ min: 2 })
		.withMessage((_, { req }) => locales[req.lang as Language].auth.invalid_secondName_length)
		.isString()
		.withMessage((_, { req }) => locales[req.lang as Language].auth.invalid_secondName_type),
];

export const signUpValidation = [
	...verifyValidation,
	body('code')
		.isLength({ min: 6 })
		.withMessage((_, { req }) => locales[req.lang as Language].auth.invalid_code),
];

export const signInValidation = [
	body('email')
		.isEmail()
		.withMessage((_, { req }) => locales[req.lang as Language].auth.invalid_email),
	body('password')
		.isLength({ min: 8 })
		.withMessage((_, { req }) => locales[req.lang as Language].auth.invalid_password),
];
