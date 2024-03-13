import { Request, Response } from 'express';
import sharp from 'sharp';
import { AppDataSource } from '../../db';
import { Image } from '../../db/entity/Image';
import { User } from '../../db/entity/User';
import redis from '../../db/redis';
import locales from '../../locales';
import sendCode from '../../tools/auth/sendCode';
import { send } from '../../tools/codes';
import { removeProperty } from '../../tools/removeProperty';
import { Language } from '../../types';
import { CODES } from './../../tools/codes/types';

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const userRepository = AppDataSource.manager.getRepository(User);
		const users = await userRepository.find({
			take: Number(req.query.take) || 50,
			skip: Number(req.query.page) || 0,
		});

		if (!users.length) return send(res, CODES.NO_CONTENT, locales[lang].user.no_users);

		const usersWithoutPassword = users.map((user) =>
			removeProperty(user, 'password', 'createdAt', 'updatedAt'),
		);
		send(res, CODES.OK, locales[lang].user.found, usersWithoutPassword);
	} catch (err: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, err.message);
	}
};

export const getOneUser = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		if (!req.params.id) return send(res, CODES.BAD_REQUEST, locales[lang].user.no_id);

		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOneBy({ id: +req.params.id });
		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].user.no_user);

		const userWithoutSensitive = removeProperty(user, 'password', 'createdAt', 'updatedAt');
		send(res, CODES.OK, locales[lang].user.found, userWithoutSensitive);
	} catch (err: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, err.message);
	}
};

export const updateOneUser = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		if (!req.params.id) return send(res, CODES.BAD_REQUEST, locales[lang].user.no_id);

		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOneBy({ id: +req.params.id });
		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].user.no_user);

		const imageRepository = AppDataSource.getRepository(Image);
		let userAvatar = user.avatar;

		const pattern = /^\+(\d{1,2})\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/;

		if (req.body.phone && !req.body.phone.match(pattern))
			return send(res, CODES.BAD_REQUEST, locales[lang].user.invalid_phone);

		if (req.body.avatar && req.body.avatar !== user.avatar) {
			if (user.avatar) {
				const existingAvatarId = user.avatar.split('/')[4];
				const existingAvatar = await imageRepository.findOneBy({
					id: existingAvatarId,
				});
				if (existingAvatar) await imageRepository.remove(existingAvatar);
			}

			const data = await sharp(Buffer.from(req.body.avatar)).webp().toBuffer();
			const image = imageRepository.create({ data });
			const savedImage = await imageRepository.save(image);
			userAvatar = `https://api.doomru.ru/image/${savedImage.id}`;
		}

		let userIsActivated = user.isActivated;

		if (req.body.email && req.body.email !== user.email) {
			const candidate = await userRepository.findOneBy({ email: req.body.email });
			if (candidate) return send(res, CODES.BAD_REQUEST, locales[lang].user.invalid_email);
			const code = Math.floor(Math.random() * 900000) + 100000;
			await redis.set(`code:${req.body.email}`, code, 'EX', 3600);
			await sendCode(req.body.email, code);
			userIsActivated = false;
		}

		const mergedUser = userRepository.merge(user, {
			...req.body,
			avatar: userAvatar,
			isActivated: userIsActivated,
		});

		await userRepository.save(mergedUser);
		const changedUserWithoutSensitive = removeProperty(
			mergedUser,
			'password',
			'createdAt',
			'updatedAt',
		);
		send(res, CODES.CREATED, locales[lang].user.changed, changedUserWithoutSensitive);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const resendCode = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		// @ts-ignore
		const userId = req.user.id as number;

		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOneBy({ id: userId });
		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].user.no_user);

		const code = Math.floor(Math.random() * 900000) + 100000;
		await redis.set(`code:${user.email}`, code, 'EX', 3600);
		await sendCode(user.email, code);

		send(res, CODES.OK, locales[lang].user.sent_code);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const deleteOneUser = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		if (!req.params.id) return send(res, CODES.BAD_REQUEST, locales[lang].user.no_id);

		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOne({
			where: { id: +req.params.id },
			relations: ['realties'],
		});

		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].user.no_user);

		await removeUserRelations(user);
		await userRepository.remove(user);
		send(res, CODES.OK, locales[lang].user.deleted);
	} catch (err: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, err.message);
	}
};

export const verifyUserCode = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		// @ts-ignore
		const userId = req.user.id as number;

		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOneBy({ id: userId });
		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].user.no_user);

		const code = req.body.code;
		if (!code) return send(res, CODES.BAD_REQUEST, locales[lang].user.missing_code);

		const codeFromRedis = await redis.get(`code:${user.email}`);
		if (!codeFromRedis) return send(res, CODES.BAD_REQUEST, locales[lang].user.deprecated_code);

		if (+code !== +codeFromRedis)
			return send(res, CODES.BAD_REQUEST, locales[lang].user.invalid_code);

		await redis.del(`code:${user.email}`);
		user.isActivated = true;
		await userRepository.save(user);

		send(res, CODES.OK, locales[lang].user.verified);
	} catch (err: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, err.message);
	}
};

const removeUserRelations = async (user: User) => {
	try {
		if (user.avatar) {
			const imageRepository = AppDataSource.getRepository(Image);
			const existingAvatarId = user.avatar.split('/')[4];
			const existingAvatar = await imageRepository.findOneBy({
				id: existingAvatarId,
			});
			if (existingAvatar) await imageRepository.remove(existingAvatar);
		}

		user.realties.forEach(async (realty) => {
			realty.remove({ data: { user } });
			realty.remove();
		});
	} catch (error: any) {
		throw new Error(error.message);
	}
};
