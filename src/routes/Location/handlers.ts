import { clientError, serverError, success } from './../../tools/codes/index';
import { Request, Response } from 'express';
import { CODES } from '../../tools/codes/types';
import local from '../../tools/local';

export const getCity = async (req: Request, res: Response) => {
	try {
		const { lat, lon } = req.query;
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		if (!lat || !lon)
			return clientError(res, CODES.BAD_REQUEST, local[lang].location.no_locations);

		const response = await fetch(
			`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`,
		);

		const data = await response.json();
		success(res, CODES.OK, local[lang].location.found, data);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
