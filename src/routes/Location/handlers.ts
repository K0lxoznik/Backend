import { Request, Response } from 'express';
import locales from '../../locales';
import { CODES } from '../../tools/codes/types';
import { Language } from '../../types';
import { send } from './../../tools/codes/index';

export const getCity = async (req: Request, res: Response) => {
	try {
		const { lat, lon } = req.query;
		const lang = req.headers['accept-language'] as Language;
		if (!lat || !lon) return send(res, CODES.BAD_REQUEST, locales[lang].location.no_lat_or_lon);

		const response = await fetch(
			`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`,
		);

		const data = await response.json();
		send(res, CODES.OK, locales[lang].location.found, data);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
