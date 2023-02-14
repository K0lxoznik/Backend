import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AppDataSource from '../../db';
import { clientError } from '../codes';
import { CODES } from '../codes/types';
import { User } from './../../db/entities/User';
import { serverError } from './../codes/index';

/** ## Protect Middleware
 * Protects the route from unauthorized access by checking the token
 * @param req express:request
 * @param res express:response
 * @param next express:next
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bearer = req.headers.authorization;
		if (!bearer) return clientError(res, CODES.BAD_REQUEST, 'No headers provided');

		const token = bearer.split(' ')[1];
		if (!token) return clientError(res, CODES.BAD_REQUEST, 'No token provided');

		const payload = jwt.verify(token, 'cookies');
		if (!payload) return clientError(res, CODES.UNAUTHORIZED, 'Invalid token');

		// @ts-ignore
		req.user = { id: +payload.id };
		next();
	} catch (error: any) {
		console.log(error);
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

/** ## Protect UserID Param Middleware
 * Protects the route from unauthorized access by checking the token and the user id in the params
 * @param req express:request
 * @param res express:response
 * @param next express:next
 */
export const protectUserIDParam = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bearer = req.headers.authorization;
		if (!bearer) return clientError(res, CODES.BAD_REQUEST, 'No headers provided');

		const token = bearer.split(' ')[1];
		if (!token) return clientError(res, CODES.BAD_REQUEST, 'No token provided');

		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOneBy({ id: +req.params.id });
		if (!user) return clientError(res, CODES.UNAUTHORIZED, 'Invalid token');

		const payload: any = jwt.verify(token, 'cookies');
		if (!payload || +payload.id !== user.id) return clientError(res, CODES.UNAUTHORIZED, 'Invalid token');

		// @ts-ignore
		req.user = { id: +payload.id };
		next();
	} catch (error: any) {
		console.log(error.message);
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
