import { clientError, serverError, success } from './../../tools/codes/index';
import { Request, Response } from 'express';
import { CODES } from '../../tools/codes/types';

export const getCity = async (req: Request, res: Response) => {
	try {
		const { lat, lon, lang = 'en' } = req.query;
		if (!lat || !lon) return clientError(res, CODES.BAD_REQUEST, 'Latitude and longitude are required');

		const response = await fetch(
			`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`,
		);

		const data = await response.json();
		success(res, CODES.OK, 'Successfully found', data);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
