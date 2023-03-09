import { RequestBody } from './../../types/index';
import { CODES } from './../codes/types';
import { User, CreateUser } from './../../db/entity/User';
import { clientError, serverError } from './../codes/index';
import { Response, NextFunction } from 'express';
import AppDataSource from '../../db';
import local from '../local';

export const validateEmail = async (
	req: RequestBody<CreateUser>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		const userRepository = AppDataSource.manager.getRepository(User);
		const email_user = await userRepository.findOneBy({ email: req.body.email });
		if (email_user)
			return clientError(res, CODES.BAD_REQUEST, local[lang].middlewares.email.exists);
		next();
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
