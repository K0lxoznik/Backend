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
export const success = (res: Response, code: CODES, message: string, data?: any) => {
	res.status(code).json({
		message,
		data,
	});
};

/** ## Client Error Response
 * The request could not be understood by the
 * server due to malformed syntax.
 * @param res express:response
 * @param code CODES
 * @param message string
 */
export const clientError = (res: Response, code: CODES, message: string) => {
	res.status(code).json({ message });
};

/** ## Server Error Response
 * The server encountered an unexpected condition
 * that prevented it from fulfilling the request.
 * @param res express:response
 * @param code CODES
 * @param message string
 */
export const serverError = (res: Response, code: CODES, message: string) => {
	res.status(code).json({ message });
};
