import { Request, Response } from 'express';
import sharp from 'sharp';
import AppDataSource from '../../db';
import { Image } from '../../db/entity/Image';
import { Realty } from '../../db/entity/Realty';
import locales from '../../locales';
import { CODES } from '../../tools/codes/types';
import { Language } from '../../types';
import { send } from './../../tools/codes/index';

export const getAllRealties = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const realtyRepository = AppDataSource.getRepository(Realty);
		const take = Number(req.query.take) || 20;
		const page = Number(req.query.page) || 0;

		const count = await realtyRepository.count();
		if (!count) return send(res, CODES.NO_CONTENT, locales[lang].realties.no_realties, 0);

		const realties = await realtyRepository.find({
			take,
			skip: page,
			relations: ['images'],
			select: {
				images: {
					id: true,
				},
			},
		});

		send(res, CODES.OK, locales[lang].realties.found, realties, { count, take, page });
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const createUserRealty = async (req: any, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const realtyRepository = AppDataSource.getRepository(Realty);
		const imageRepository = AppDataSource.getRepository(Image);

		const realty = realtyRepository.manager.create<Realty>(Realty, {
			...req.body,
			user: { id: req.user.id },
		});

		const images = [];

		for (const img of req.body.images) {
			const data = await sharp(Buffer.from(img)).webp().toBuffer();
			const image = imageRepository.create({ data, realty: { id: realty.id } });
			images.push(image);
		}

		const savedImages = await imageRepository.save(images);
		realtyRepository.merge(realty, { images: savedImages });
		await realtyRepository.save(realty);

		const result = await realtyRepository.findOne({
			where: { id: realty.id },
			relations: ['images'],
			select: {
				images: {
					id: true,
				},
			},
		});

		send(res, CODES.CREATED, locales[lang].realties.created, result);
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

		const realtyRepository = AppDataSource.getRepository(Realty);
		const imageRepository = AppDataSource.getRepository(Image);

		const realty = await realtyRepository.findOne({
			where: { id: +req.params.id },
			relations: ['images'],
			select: { images: true },
		});

		if (!realty) return send(res, CODES.NOT_FOUND, locales[lang].realties.no_realties);

		const images = [];
		for (const img of req.body.images) {
			const data = await sharp(Buffer.from(img)).webp().toBuffer();
			const image = imageRepository.create({ data, realty: { id: realty.id } });
			images.push(image);
		}

		const savedImages = await imageRepository.save(images);
		realtyRepository.merge(realty, {
			...req.body,
			images: realty.images.concat(savedImages),
		});

		await realtyRepository.save(realty);
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

		const realtyRepository = AppDataSource.getRepository(Realty);
		const imageRepository = AppDataSource.getRepository(Image);

		const realty = await realtyRepository.findOne({
			where: { id: +req.params.id },
			relations: ['images'],
			select: { images: true },
		});

		if (!realty) return send(res, CODES.NOT_FOUND, locales[lang].realties.no_realties);

		await imageRepository.remove(realty.images);
		await realtyRepository.remove(realty);
		send(res, CODES.OK, locales[lang].realties.deleted);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
