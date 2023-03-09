import { Response } from 'express';
import { CODES } from './types';

/** ## Success Response
 * The request has succeeded. The information
 * returned with the response is dependent
 * on the method used in the request
 * @param res express:response
 * @param code CODES
 * @param message string
 * @param data any
 */
export const send = (res: Response, code: CODES, message: string, data?: any) => {
	res.status(code).json({
		message,
		data,
	});
};
