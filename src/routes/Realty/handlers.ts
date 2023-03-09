import { Request, Response } from 'express';
import AppDataSource from '../../db';
import { Realty } from '../../db/entity/Realty';
import locales from '../../locales';
import { CODES } from '../../tools/codes/types';
import { Language } from '../../types';
import { send } from './../../tools/codes/index';

export const getAllRealties = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const realtyRepository = AppDataSource.manager.getRepository(Realty);
		const take = Number(req.query.take) || 50;
		const skip = Number(req.query.page) || 0;
		const realties = await realtyRepository.find({ take, skip });
		if (!realties.length)
			return send(res, CODES.NO_CONTENT, locales[lang].realties.no_realties);
		send(res, CODES.OK, locales[lang].realties.found, realties);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const createUserRealty = async (req: any, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const realtyRepository = AppDataSource.manager.getRepository(Realty);
		const realty = realtyRepository.manager.create(Realty, {
			...req.body,
			user: {
				id: req.user.id,
			},
		});
		await realtyRepository.save(realty);
		send(res, CODES.CREATED, locales[lang].realties.created, realty);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const getOneRealty = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		if (!req.params.id) return send(res, CODES.BAD_REQUEST, locales[lang].realties.no_id);
		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id });
		if (!realty) return send(res, CODES.NOT_FOUND, locales[lang].realties.no_realties);
		send(res, CODES.OK, locales[lang].realties.found, realty);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const updateOneRealty = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		if (!req.params.id) return send(res, CODES.BAD_REQUEST, locales[lang].realties.no_id);
		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id });
		if (!realty) return send(res, CODES.NOT_FOUND, locales[lang].realties.no_realties);

		realtyTable.merge(realty, req.body);
		await realtyTable.save(realty);
		send(res, CODES.OK, locales[lang].realties.changed, realty);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const deleteOneRealty = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		if (!req.params.id) return send(res, CODES.BAD_REQUEST, locales[lang].realties.no_id);
		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id });
		if (!realty) return send(res, CODES.NOT_FOUND, locales[lang].realties.no_realties);
		await realtyTable.remove(realty);
		send(res, CODES.OK, locales[lang].realties.deleted, realty);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
