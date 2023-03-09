import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CODES } from '../codes/types';
import { send } from './../codes/index';

/** ## Validation
 * Common middleware for validation body
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns errors[]
 */
export const checkValidation = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) return next();
	send(res, CODES.BAD_REQUEST, 'validation', errors.array());
};
