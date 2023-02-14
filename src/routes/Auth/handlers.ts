import { clientError, serverError, success } from './../../tools/codes/index';
import { Request, Response } from 'express';
import AppDataSource from '../../db';
import { User } from '../../db/entity/User';
import { comparePassword, createJWT, hashPassword } from '../../tools/auth/jwt';
import { CODES } from '../../tools/codes/types';

export const signUpUser = async (req: Request, res: Response) => {
	try {
		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOneBy({ email: req.body.email });
		if (user) return clientError(res, CODES.BAD_REQUEST, 'User with this email already exists');

		const newUser = userRepository.manager.create(User, {
			...req.body,
			password: await hashPassword(req.body.password),
		});

		await AppDataSource.manager.save(newUser);
		const token = createJWT(newUser);
		success(res, CODES.CREATED, 'Successfully signed up', token);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const signInUser = async (req: Request, res: Response) => {
	try {
		const userRepository = AppDataSource.manager.getRepository(User);
		const firstUser = await userRepository.findOneBy({ email: req.body.email });
		if (!firstUser) return clientError(res, CODES.BAD_REQUEST, 'Incorrect email or password');

		const compared = await comparePassword(req.body.password, firstUser.password);
		if (!compared) return clientError(res, CODES.BAD_REQUEST, 'Incorrect email or password');

		const token = createJWT(firstUser);
		success(res, CODES.ACCEPTED, 'Successfully signed in', token);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
