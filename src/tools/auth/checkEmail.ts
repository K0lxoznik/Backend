import { NextFunction, Response } from 'express';
import AppDataSource from '../../db';
import { CreateUser, User } from '../../db/entity/User';
import locales from '../../locales';
import { Language, RequestBody } from '../../types/index';
import { send } from '../codes/index';
import { CODES } from '../codes/types';

export const checkEmail = async (
	req: RequestBody<CreateUser>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const lang = req.headers['accept-language'] as Language;
		const userRepository = AppDataSource.manager.getRepository(User);
		const email_user = await userRepository.findOneBy({ email: req.body.email });
		if (email_user)
			return send(res, CODES.BAD_REQUEST, locales[lang].middlewares.validateEmail.exists);
		next();
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
