import { Response } from 'express';
import { CODES } from './types';

/** ## Response Function
 * The information returned with the
 * response is dependent on the method
 * used in the request
 * @param res Response
 * @param code CODES
 * @param message string
 * @param data any
 * @param extra config for response
 */
export const send = (res: Response, code: CODES, message: string, data?: any, extra?: any) => {
	res.status(code).json({
		message,
		data,
		...extra,
	});
};
