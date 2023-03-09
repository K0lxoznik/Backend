import { clientError } from './../../tools/codes/index';
import { Request, Response } from 'express';
import AppDataSource from '../../db';
import { serverError, success } from '../../tools/codes';
import { CODES } from '../../tools/codes/types';
import { Realty } from '../../db/entity/Realty';
import local from '../../tools/local';

export const getAllRealties = async (req: Request, res: Response) => {
	try {
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		const realtyRepository = AppDataSource.manager.getRepository(Realty);
		const take = Number(req.query.take) || 50;
		const skip = Number(req.query.page) || 0;
		const realties = await realtyRepository.find({ take, skip });
		if (!realties.length)
			return success(res, CODES.NO_CONTENT, local[lang].realties.no_realties);
		success(res, CODES.OK, local[lang].realties.found, realties);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const createUserRealty = async (req: any, res: Response) => {
	try {
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		const realtyRepository = AppDataSource.manager.getRepository(Realty);
		const realty = realtyRepository.manager.create(Realty, {
			...req.body,
			user: {
				id: req.user.id,
			},
		});
		await realtyRepository.save(realty);
		success(res, CODES.CREATED, local[lang].realties.created, realty);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const getOneRealty = async (req: Request, res: Response) => {
	try {
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		if (!req.params.id) return clientError(res, CODES.BAD_REQUEST, local[lang].realties.no_id);
		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id });
		if (!realty) return clientError(res, CODES.NOT_FOUND, local[lang].realties.no_realties);
		success(res, CODES.OK, local[lang].realties.found, realty);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const updateOneRealty = async (req: Request, res: Response) => {
	try {
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		if (!req.params.id) return clientError(res, CODES.BAD_REQUEST, local[lang].realties.no_id);
		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id });
		if (!realty) return clientError(res, CODES.NOT_FOUND, local[lang].realties.no_realties);

		realtyTable.merge(realty, req.body);
		await realtyTable.save(realty);
		success(res, CODES.OK, local[lang].realties.change, realty);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const deleteOneRealty = async (req: Request, res: Response) => {
	try {
		const lang = req.headers['accept-language'] as 'ru' | 'en';
		if (!req.params.id) return clientError(res, CODES.BAD_REQUEST, local[lang].realties.no_id);
		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id });
		if (!realty) return clientError(res, CODES.NOT_FOUND, local[lang].realties.no_realties);
		await realtyTable.remove(realty);
		success(res, CODES.OK, local[lang].realties.deleted, realty);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
