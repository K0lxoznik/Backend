import { body } from 'express-validator';
export const validateRealtyCreation = [
	body('action')
		.matches(/^(rent|buy)$/)
		.withMessage('Action must be rent or buy'),
	body('type')
		.matches(/^(apartment|room|studio|cottage|hostel|house)$/)
		.withMessage('Type must be apartment, room, studio, cottage, hostel or house'),
	body('term')
		.matches(/^(day|month)$/)
		.withMessage('Term must be day or month'),
	body('currency')
		.matches(/^(RUB|USD)$/)
		.withMessage('Currency must be RUB or USD'),
	body('houseType')
		.matches(/^(brick|panel|monolith|wood|other)$/)
		.withMessage('House type must be brick, panel, monolith, wood or other'),
	body('repair')
		.matches(/^(design|euro|cosmetic|without)$/)
		.withMessage('Repair must be design, euro, cosmetic or without'),
	body('price').isFloat({ min: 0 }).withMessage('Price must be a number'),
	body('rooms').isInt({ min: 1 }).withMessage('Rooms must be a number'),
	body('title')
		.isString()
		.isLength({ min: 1, max: 100 })
		.withMessage('Title must be a string and have length from 1 to 100'),
	body('description')
		.isString()
		.isLength({ min: 1, max: 1000 })
		.withMessage('Description must be a string and have length from 1 to 1000'),
	body('address')
		.isString()
		.isLength({ min: 1, max: 100 })
		.withMessage('Address must be a string and have length from 1 to 100'),
	body('area').isFloat({ min: 0 }).withMessage('Area must be a number'),
	body('elevator').isBoolean().withMessage('Elevator must be a boolean'),
	body('bathrooms').isInt().withMessage('Bathrooms must be a number'),
	body('images')
		.isArray()
		.isLength({ min: 1, max: 10 })
		.withMessage('Images must be an array and have length from 1 to 10'),
];

export const validateRealtyUpdation = [
	body('action')
		.optional()
		.matches(/^(rent|buy)$/)
		.withMessage('Action must be rent or buy'),
	body('type')
		.optional()
		.matches(/^(apartment|room|studio|cottage|hostel|house)$/)
		.withMessage('Type must be apartment, room, studio, cottage, hostel or house'),
	body('term')
		.optional()
		.matches(/^(day|month)$/)
		.withMessage('Term must be day or month'),
	body('currency')
		.optional()
		.matches(/^(RUB|USD)$/)
		.withMessage('Currency must be RUB or USD'),
	body('houseType')
		.optional()
		.matches(/^(brick|panel|monolith|wood|other)$/)
		.withMessage('House type must be brick, panel, monolith, wood or other'),
	body('repair')
		.optional()
		.matches(/^(design|euro|cosmetic|without)$/)
		.withMessage('Repair must be design, euro, cosmetic or without'),
	body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a number'),
	body('rooms').optional().isInt({ min: 1 }).withMessage('Rooms must be a number'),
	body('title')
		.optional()
		.isString()
		.isLength({ min: 1, max: 100 })
		.withMessage('Title must be a string and have length from 1 to 100'),
	body('description')
		.optional()
		.isString()
		.isLength({ min: 1, max: 1000 })
		.withMessage('Description must be a string and have length from 1 to 1000'),
	body('address')
		.optional()
		.isString()
		.isLength({ min: 1, max: 100 })
		.withMessage('Address must be a string and have length from 1 to 100'),
	body('area').optional().isFloat({ min: 0 }).withMessage('Area must be a number'),
	body('elevator').optional().isBoolean().withMessage('Elevator must be a boolean'),
	body('bathrooms').optional().isInt().withMessage('Bathrooms must be a number'),
	body('images')
		.optional()
		.isArray()
		.isLength({ min: 1, max: 10 })
		.withMessage('Images must be an array and have length from 1 to 10'),
];
