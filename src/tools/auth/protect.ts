import { Realty } from './../../db/entities/Realty';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AppDataSource from '../../db';
import { clientError } from '../codes';
import { CODES } from '../codes/types';
import { User } from './../../db/entities/User';
import { serverError } from './../codes/index';
import config from '../../config';


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

		const payload = jwt.verify(token, config.JWT_SECRET);
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
		if (!bearer) return clientError(res, CODES.BAD_REQUEST, 'Authorization укажи, еблан');

		const token = bearer.split(' ')[1];
		if (!token) return clientError(res, CODES.BAD_REQUEST, 'Токен укажи, еблан');

		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOneBy({ id: +req.params.id });
		if (!user) return clientError(res, CODES.UNAUTHORIZED, 'Нахуй пошел');

		const payload: any = jwt.verify(token, config.JWT_SECRET);
		if (!payload || +payload.id !== user.id) return clientError(res, CODES.UNAUTHORIZED, 'Нахуй пошел');
		
		// @ts-ignore
		req.user = { id: +payload.id };
		next();
	} catch (error: any) {
		console.log(error.message);
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const protectRealtyIDParam = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bearer = req.headers.authorization;
		if (!bearer) return clientError(res, CODES.BAD_REQUEST, 'Authorization укажи, еблан');

		const token = bearer.split(' ')[1];
		if (!token) return clientError(res, CODES.BAD_REQUEST, 'Токен укажи, еблан');
		
		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id });
		if (!realty) return clientError(res, CODES.NOT_FOUND, 'Такой квартиры нет');

		const user: any = jwt.verify(token, config.JWT_SECRET);
		const userTable = AppDataSource.getRepository(User);
		const owner = await userTable.findOne({ where: { realties: { id: +req.params.id } }, select: { id: true }});
		if (!owner) return clientError(res, CODES.NOT_FOUND, 'Хз, что-то пошло не так');
		if (!user || +user.id !== +owner.id) return clientError(res, CODES.UNAUTHORIZED, 'Нахуй пошел');
		
		// @ts-ignore
		req.user = { id: +user.id };
		next();
	} catch (error: any) {
		console.log(error.message);
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
