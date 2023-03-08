import { Request, Response } from 'express';
import AppDataSource from '../../db';
import { User } from '../../db/entity/User';
import { clientError, serverError, success } from '../../tools/codes';
import { CODES } from '../../tools/codes/types';
import local from '../../tools/local';

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		const userRepository = AppDataSource.manager.getRepository(User);
		const users = await userRepository.find({
			take: Number(req.query.take) || 50,
			skip: Number(req.query.page) || 0,
		});

		if (!users.length) return success(res, CODES.NO_CONTENT, local[lang].user.no_users);

		const usersWithoutPassword = users.map((user) => ({ ...user, password: undefined }));
		success(res, CODES.OK, local[lang].user.found, usersWithoutPassword);
	} catch (err: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, err.message);
	}
};

export const getOneUser = async (req: Request, res: Response) => {
	try {
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		if (!req.params.id) return clientError(res, CODES.BAD_REQUEST, local[lang].user.no_id);

		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOneBy({ id: +req.params.id });
		if (!user) return clientError(res, CODES.NOT_FOUND, local[lang].user.no_user);

		const userWithoutPassword = { ...user, password: undefined };
		success(res, CODES.OK, local[lang].user.found, userWithoutPassword);
	} catch (err: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, err.message);
	}
};

export const updateOneUser = async (req: Request, res: Response) => {
	try {
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		if (!req.params.id) return clientError(res, CODES.BAD_REQUEST, "User's id is required");

		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOneBy({ id: +req.params.id });
		if (!user) return clientError(res, CODES.NOT_FOUND, "User with this id doesn't exist");

		userRepository.merge(user, req.body);
		const changedUser = await userRepository.save(user);
		const changedUserWithoutPassword = { ...changedUser, password: undefined };
		success(res, CODES.CREATED, local[lang].user.found, changedUserWithoutPassword);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const deleteOneUser = async (req: Request, res: Response) => {
	try {
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		if (!req.params.id) return clientError(res, CODES.BAD_REQUEST, "User's id is required");

		const userRepository = AppDataSource.manager.getRepository(User);
		const user = await userRepository.findOne({
			where: { id: +req.params.id },
			relations: ['realties'],
		});

		if (!user) return clientError(res, CODES.NOT_FOUND, local[lang].user.no_user);

		await removeUserRelations(user);
		await userRepository.remove(user);
		success(res, CODES.OK, local[lang].user.deleted);
	} catch (err: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, err.message);
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
