import { CODES } from './../codes/types';
import { clientError, serverError } from './../codes/index';
import { Request, Response, NextFunction } from 'express';
export function checkLanguage(req: Request, res: Response, next: NextFunction) {
	try {
		const lang = req.headers['accept-language'];
		if (lang !== 'ru' && lang !== 'en')
			return clientError(res, CODES.UNAUTHORIZED, 'An invalid link');
		next();
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
}
