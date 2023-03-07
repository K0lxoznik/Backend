import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import config from '../../config';
import AppDataSource from '../../db';
import { User } from '../../db/entity/User';
import redis from '../../db/redis';
import { removeProperty } from '../../tools';
import { comparePassword, createJWT, hashPassword } from '../../tools/auth/jwt';
import { CODES } from '../../tools/codes/types';
import { CreateUser, CreateUserWithCode } from './../../db/entity/User';
import { clientError, serverError, success } from './../../tools/codes/index';
import { RequestBody } from './../../types';

export const getMe = async (req: Request, res: Response) => {
	try {
		const userRepository = AppDataSource.manager.getRepository(User);
		// @ts-ignore
		const user = await userRepository.findOneBy({ id: req.user.id });

		if (!user) return clientError(res, CODES.NOT_FOUND, "Your account has been deleted"); 

		const responseData = {
			user: removeProperty(user, 'createdAt', 'updatedAt', 'password'),
		};

		success(res, CODES.OK, 'User has been found', responseData);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const sendCodeToEmail = async (req: RequestBody<CreateUser>, res: Response) => {
	try {
		const code = Math.floor(Math.random() * 900000) + 100000;

		await redis.set(`code:${req.body.email}`, code, 'EX', 300);

		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: config.SEND_EMAIL,
				pass: config.SEND_PASSWORD,
			},
		});

		let result = await transporter.sendMail({
			from: 'vladpolisuk159@gmail.com',
			to: req.body.email,
			subject: 'DOOM.RU | Verify email',
			text: `Your code: ${code}`,
			html: `<h1>Your code: ${code}</h1>`,
		});

		success(res, CODES.CREATED, 'Code has been send', result.accepted);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const signUpUser = async (req: RequestBody<CreateUserWithCode>, res: Response) => {
	try {
		const code = req.body.code;
		const codeFromRedis = await redis.get(`code:${req.body.email}`);
		if (!code) return clientError(res, CODES.BAD_REQUEST, 'Missing code');
		if (!codeFromRedis) return clientError(res, CODES.BAD_REQUEST, 'Code is deprecated');
		if (+code !== +codeFromRedis) return clientError(res, CODES.BAD_REQUEST, 'Incorrect code');

		const userRepository = AppDataSource.manager.getRepository(User);
		const newUser = userRepository.manager.create(User, {
			...req.body,
			password: await hashPassword(req.body.password),
		});

		await AppDataSource.manager.save(newUser);
		const token = createJWT(newUser);
		const responseData = {
			token,
			user: removeProperty(newUser, 'createdAt', 'updatedAt', 'password'),
		};
		success(res, CODES.CREATED, 'Successfully signed up', responseData);
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
		const responseData = {
			token,
			user: removeProperty(firstUser, 'createdAt', 'updatedAt', 'password'),
		};
		success(res, CODES.ACCEPTED, 'Successfully signed in', responseData);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
