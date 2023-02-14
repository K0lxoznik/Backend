import { clientError } from './../../tools/codes/index';
import { Request, Response } from 'express';
import AppDataSource from '../../db';
import { serverError, success } from '../../tools/codes';
import { CODES } from '../../tools/codes/types';
import { Realty } from './../../db/entities/Realty';

export const getAllRealties = async (req: Request, res: Response) => {
	try {
		const realtyRepository = AppDataSource.manager.getRepository(Realty);
		const take = Number(req.query.take) || 50;
		const skip = Number(req.query.page) || 0;
		const realties = await realtyRepository.find({ take, skip });
		if (!realties.length) return success(res, CODES.NO_CONTENT, 'No realties found');
		success(res, CODES.OK, 'Successfully found', realties);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const createUserRealty = async (req: any, res: Response) => {
	try {
		const realtyRepository = AppDataSource.manager.getRepository(Realty);
		const realty = realtyRepository.manager.create(Realty, {
			...req.body,
			user: {
				id: req.user.id,
			},
		});
		await realtyRepository.save(realty);
		success(res, CODES.CREATED, 'Successfully created', realty);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const getOneRealty = async (req: Request, res: Response) => {
	try {
		if (!req.params.id) return clientError(res, CODES.BAD_REQUEST, "Realty's id is required");
		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id})
		if (!realty) return clientError(res, CODES.NOT_FOUND, 'Realty not found');
		success(res, CODES.OK, 'Successfully found', realty);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const updateOneRealty = async (req: Request, res: Response) => {
	try {
		if (!req.params.id) return clientError(res, CODES.BAD_REQUEST, "Realty's id is required");
		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id})
		if (!realty) return clientError(res, CODES.NOT_FOUND, 'Realty not found');
		
		realtyTable.merge(realty, req.body);
		await realtyTable.save(realty);
		success(res, CODES.OK, 'Successfully updated', realty);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}

};

export const deleteOneRealty = async (req: Request, res: Response) => {
	try {
		if (!req.params.id) return clientError(res, CODES.BAD_REQUEST, "Realty's id is required");
		const realtyTable = AppDataSource.getRepository(Realty);
		const realty = await realtyTable.findOneBy({ id: +req.params.id})
		if (!realty) return clientError(res, CODES.NOT_FOUND, 'Realty not found');
		await realtyTable.remove(realty);
		success(res, CODES.OK, 'Successfully deleted', realty);
	} catch (error: any) {
		serverError(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
