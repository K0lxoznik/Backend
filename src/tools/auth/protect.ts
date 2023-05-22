import cookie from 'cookie';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { AppDataSource } from '../../db';
import { Realty } from '../../db/entity/Realty';
import { User } from '../../db/entity/User';
import { send } from '../codes';
import { CODES } from '../codes/types';

/** ## Protect Middleware
 * Protects the route from unauthorized access by checking the token
 * @param req express:request
 * @param res express:response
 * @param next express:next
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cookies = cookie.parse(req.headers.cookie || '');
		const token = cookies.token;
		if (!token) return send(res, CODES.BAD_REQUEST, 'No token provided');

		const cookieExpiration = new Date(req.cookies.token.expires).getTime();
		const currentTime = new Date().getTime();
		if (cookieExpiration < currentTime)
			return send(res, CODES.FORBIDDEN, 'Token is deprecated');

		const payload = jwt.verify(token, config.JWT_SECRET);
		if (!payload) return send(res, CODES.UNAUTHORIZED, 'Invalid token');

		// @ts-ignore
		req.user = { id: +payload.id };
		next();
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
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
		const cookies = cookie.parse(req.headers.cookie || '');
		const token = cookies.token;
		if (!token) return send(res, CODES.BAD_REQUEST, 'No token provided');

		const cookieExpiration = new Date(req.cookies.token.expires).getTime();
		const currentTime = new Date().getTime();
		if (cookieExpiration < currentTime)
			return send(res, CODES.FORBIDDEN, 'Token is deprecated');

		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOneBy({ id: +req.params.id });
		if (!user) return send(res, CODES.UNAUTHORIZED, 'Invalid token');

		const payload: any = jwt.verify(token, config.JWT_SECRET);
		if (!payload || +payload.id !== user.id)
			return send(res, CODES.UNAUTHORIZED, 'Invalid token');

		// @ts-ignore
		req.user = { id: +payload.id };
		next();
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const protectRealtyIDParam = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cookies = cookie.parse(req.headers.cookie || '');
		const token = cookies.token;
		if (!token) return send(res, CODES.BAD_REQUEST, 'No token provided');

		const cookieExpiration = new Date(req.cookies.token.expires).getTime();
		const currentTime = new Date().getTime();
		if (cookieExpiration < currentTime)
			return send(res, CODES.FORBIDDEN, 'Token is deprecated');

		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id });
		if (!realty) return send(res, CODES.NOT_FOUND, 'Такой квартиры нет');

		const user: any = jwt.verify(token, config.JWT_SECRET);
		const userTable = AppDataSource.getRepository(User);
		const owner = await userTable.findOne({
			where: { realties: { id: +req.params.id } },
			select: { id: true },
		});

		if (!owner) return send(res, CODES.NOT_FOUND, 'Хз, что-то пошло не так');
		if (!user || +user.id !== +owner.id) return send(res, CODES.UNAUTHORIZED, 'Invalid token');

		// @ts-ignore
		req.user = { id: +user.id };
		next();
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
