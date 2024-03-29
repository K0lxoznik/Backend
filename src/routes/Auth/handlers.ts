import cookie from 'cookie';
import { Request, Response } from 'express';
import config from '../../config';
import { AppDataSource } from '../../db';
import { User } from '../../db/entity/User';
import redis from '../../db/redis';
import locales from '../../locales';
import { comparePassword, createJWT, hashPassword } from '../../tools/auth/jwt';
import sendCode from '../../tools/auth/sendCode';
import { CODES } from '../../tools/codes/types';
import { removeProperty } from '../../tools/removeProperty';
import { CreateUser, CreateUserWithCode } from './../../db/entity/User';
import { send } from './../../tools/codes/index';
import { Language, RequestBody } from './../../types';

export const getMe = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const userRepository = AppDataSource.manager.getRepository(User);

		// @ts-ignore
		const user = await userRepository.findOneBy({ id: req.user.id });
		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].auth.user_deleted);

		const responseData = removeProperty(user, 'createdAt', 'updatedAt', 'password');
		send(res, CODES.OK, locales[lang].auth.found, responseData);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const sendCodeToEmail = async (req: RequestBody<CreateUser>, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const userRepository = AppDataSource.manager.getRepository(User);
		const email_user = await userRepository.findOneBy({ email: req.body.email });
		if (email_user)
			return send(res, CODES.BAD_REQUEST, locales[lang].middlewares.validateEmail.exists);

		const code = Math.floor(Math.random() * 900000) + 100000;
		await redis.set(`code:${req.body.email}`, code, 'EX', 300);
		await sendCode(req.body.email, code);

		send(res, CODES.CREATED, locales[lang].auth.code_sent);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const signUpUser = async (req: RequestBody<CreateUserWithCode>, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const userRepository = AppDataSource.manager.getRepository(User);
		const email_user = await userRepository.findOneBy({ email: req.body.email });
		if (email_user)
			return send(res, CODES.BAD_REQUEST, locales[lang].middlewares.validateEmail.exists);

		const code = req.body.code;
		if (!code) return send(res, CODES.BAD_REQUEST, locales[lang].auth.code_missing);

		const codeFromRedis = await redis.get(`code:${req.body.email}`);
		if (!codeFromRedis) return send(res, CODES.BAD_REQUEST, locales[lang].auth.code_deprecated);

		if (+code !== +codeFromRedis)
			return send(res, CODES.BAD_REQUEST, locales[lang].auth.code_wrong);

		const newUser = userRepository.manager.create(User, {
			...req.body,
			isActivated: true,
			password: await hashPassword(req.body.password),
		});

		await AppDataSource.manager.save(newUser);

		const token = createJWT(newUser);

		res.setHeader(
			'Set-Cookie',
			cookie.serialize('token', token, {
				httpOnly: true,
				secure: true,
				domain: config.DOMAIN,
				maxAge: 60 * 60 * 24 * 20,
				sameSite: 'none',
				path: '/',
			}),
		);

		const responseData = removeProperty(newUser, 'createdAt', 'updatedAt', 'password');
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

		const token = createJWT(firstUser, req.body.remember);

		res.setHeader(
			'Set-Cookie',
			cookie.serialize('token', token, {
				httpOnly: true,
				secure: true,
				domain: config.DOMAIN,
				maxAge: req.body.remember ? 60 * 60 * 24 * 20 : 60 * 15,
				sameSite: 'none',
				path: '/',
			}),
		);

		const responseData = removeProperty(firstUser, 'createdAt', 'updatedAt', 'password');
		send(res, CODES.ACCEPTED, locales[lang].auth.user_signed_in, responseData);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const signOutUser = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		res.clearCookie('token', { path: '/', domain: config.DOMAIN });
		send(res, CODES.OK, locales[lang].auth.user_signed_out);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
