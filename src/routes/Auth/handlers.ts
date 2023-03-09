import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import config from '../../config';
import AppDataSource from '../../db';
import { User } from '../../db/entity/User';
import redis from '../../db/redis';
import locales from '../../locales';
import { comparePassword, createJWT, hashPassword } from '../../tools/auth/jwt';
import { CODES } from '../../tools/codes/types';
import { removeProperty } from '../../tools/removeProperty';
import { CreateUser, CreateUserWithCode } from './../../db/entity/User';
import { send } from './../../tools/codes/index';
import { Language, RequestBody } from './../../types';

export const getMe = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const userId = req.user.id;
		// @ts-ignore
		const lang = req.lang as Language;

		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOneBy({ id: userId });

		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].auth.user_deleted);

		const responseData = {
			user: removeProperty(user, 'createdAt', 'updatedAt', 'password'),
		};

		send(res, CODES.OK, locales[lang].auth.found, responseData);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const sendCodeToEmail = async (req: RequestBody<CreateUser>, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;

		const code = Math.floor(Math.random() * 900000) + 100000;

		await redis.set(`code:${req.body.email}`, code, 'EX', 300);

		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: config.SEND_EMAIL,
				pass: config.SEND_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: 'vladpolisuk159@gmail.com',
			to: req.body.email,
			subject: 'DOOM.RU | Verify email',
			text: `Your code: ${code}`,
			html: `<h1>Your code: ${code}</h1>`,
		});

		send(res, CODES.CREATED, locales[lang].auth.code_sent);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const signUpUser = async (req: RequestBody<CreateUserWithCode>, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const code = req.body.code;
		const codeFromRedis = await redis.get(`code:${req.body.email}`);
		if (!code) return send(res, CODES.BAD_REQUEST, locales[lang].auth.code_missing);
		if (!codeFromRedis) return send(res, CODES.BAD_REQUEST, locales[lang].auth.code_deprecated);
		if (+code !== +codeFromRedis)
			return send(res, CODES.BAD_REQUEST, locales[lang].auth.code_wrong);

		const userRepository = AppDataSource.manager.getRepository(User);
		const newUser = userRepository.manager.create(User, {
			...req.body,
			password: await hashPassword(req.body.password),
		});

		await AppDataSource.manager.save(newUser);

		const responseData = {
			token: createJWT(newUser),
			user: removeProperty(newUser, 'createdAt', 'updatedAt', 'password'),
		};

		send(res, CODES.CREATED, locales[lang].auth.user_signed_up, responseData);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const signInUser = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const userRepository = AppDataSource.manager.getRepository(User);

		const firstUser = await userRepository.findOneBy({ email: req.body.email });
		if (!firstUser)
			return send(res, CODES.BAD_REQUEST, locales[lang].auth.incorrect_email_or_pass);

		const compared = await comparePassword(req.body.password, firstUser.password);
		if (!compared)
			return send(res, CODES.BAD_REQUEST, locales[lang].auth.incorrect_email_or_pass);

		const responseData = {
			token: createJWT(firstUser, req.body.rememberMe),
			user: removeProperty(firstUser, 'createdAt', 'updatedAt', 'password'),
		};

		send(res, CODES.ACCEPTED, locales[lang].auth.user_signed_in, responseData);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
