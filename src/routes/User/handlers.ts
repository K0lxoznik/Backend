import { Request, Response } from 'express';
import AppDataSource from '../../db';
import { User } from '../../db/entity/User';
import locales from '../../locales';
import { send } from '../../tools/codes';
import { CODES } from '../../tools/codes/types';
import { Language } from '../../types';

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

		const usersWithoutPassword = users.map((user) => ({ ...user, password: undefined }));
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

		const userWithoutPassword = { ...user, password: undefined };
		send(res, CODES.OK, locales[lang].user.found, userWithoutPassword);
	} catch (err: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, err.message);
	}
};

export const updateOneUser = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		if (!req.params.id) return send(res, CODES.BAD_REQUEST, locales[lang].user.no_id);

		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOneBy({ id: +req.params.id });
		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].user.no_user);

		userRepository.merge(user, req.body);
		const changedUser = await userRepository.save(user);
		const changedUserWithoutPassword = { ...changedUser, password: undefined };
		send(res, CODES.CREATED, locales[lang].user.changed, changedUserWithoutPassword);
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

const removeUserRelations = async (user: User) => {
	try {
		user.realties.forEach(async (realty) => {
			realty.remove({ data: { user } });
			realty.remove();
		});
	} catch (error: any) {
		throw new Error(error.message);
	}
};
