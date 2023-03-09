import { NextFunction, Request, Response } from 'express';
import { Language } from '../../types/index';
import { send } from '../codes/index';
import { CODES } from '../codes/types';

export function checkLanguage(req: Request, res: Response, next: NextFunction) {
	try {
		const lang = req.headers['accept-language'] as Language;

		if (!lang || (lang !== 'en' && lang !== 'ru'))
			return send(res, CODES.UNAUTHORIZED, 'Invalid Accept-Language');

		// @ts-ignore
		req.lang = lang;
		next();
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
}
