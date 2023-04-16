import { body } from 'express-validator';
import locales from '../../locales';
import { Language } from '../../types';

export const createUserRealtyValidation = [
	body('action')
		.matches(/^(rent|buy)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_action),
	body('type')
		.matches(/^(apartment|room|studio|cottage|hostel|house)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_type),
	body('term')
		.matches(/^(day|month|forever)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_term),
	body('currency')
		.matches(/^(RUB|USD)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_currency),
	body('houseType')
		.matches(/^(brick|panel|monolith|wood|other)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_houseType),
	body('repair')
		.matches(/^(design|euro|cosmetic|without)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_repair),
	body('price')
		.isFloat({ min: 0 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_price),
	body('rooms')
		.isInt({ min: 1 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_rooms),
	body('title')
		.isString()
		.isLength({ min: 1, max: 100 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_title),
	body('description')
		.isString()
		.isLength({ min: 1, max: 2500 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_description),
	body('address')
		.isString()
		.isLength({ min: 1, max: 100 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_address),
	body('area')
		.isFloat({ min: 1 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_area),
	body('elevator')
		.isBoolean()
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_elevator),
	body('images')
		.isArray()
		.custom((value) => (value.length > 10 ? false : true))
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_images),
];

export const updateOneRealtyValidation = [
	body('action')
		.optional()
		.matches(/^(rent|buy)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_action),
	body('type')
		.optional()
		.matches(/^(apartment|room|studio|cottage|hostel|house)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_type),
	body('term')
		.optional()
		.matches(/^(day|month|forever)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_term),
	body('currency')
		.optional()
		.matches(/^(RUB|USD)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_currency),
	body('houseType')
		.optional()
		.matches(/^(brick|panel|monolith|wood|other)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_houseType),
	body('repair')
		.optional()
		.matches(/^(design|euro|cosmetic|without)$/)
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_repair),
	body('price')
		.optional()
		.isFloat({ min: 0 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_price),
	body('rooms')
		.optional()
		.isInt({ min: 1 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_rooms),
	body('title')
		.optional()
		.isString()
		.isLength({ min: 1, max: 100 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_title),
	body('description')
		.optional()
		.isString()
		.isLength({ min: 1, max: 1000 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_description),
	body('address')
		.optional()
		.isString()
		.isLength({ min: 1, max: 100 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_address),
	body('area')
		.optional()
		.isFloat({ min: 1 })
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_area),
	body('elevator')
		.optional()
		.isBoolean()
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_elevator),
	body('images')
		.optional()
		.isArray()
		.custom((value) => (value.length > 10 ? false : true))
		.withMessage((_, { req }) => locales[req.lang as Language].realties.invalid_images),
];
