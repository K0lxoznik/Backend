import { Request, Response } from 'express';
import sharp from 'sharp';
import { Between, ILike, In } from 'typeorm';
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
		const skip = take * (page - 1);
		const {
			address,
			type,
			rooms,
			term,
			action,
			beds,
			price_to,
			price_from,
			area_from,
			area_to,
			floor_from,
			floor_to,
			repair,
			sort_by,
			elevator,
			mortgage,
			house_type,
		} = req.query;

		const totalCount = await realtyRepository.count();

		if (!totalCount) 
			return send(res, CODES.NO_CONTENT, locales[lang].realties.no_realties);

		const count = await realtyRepository.count({
			where: {
				address: ILike(`%${address || ""}%`),
				type: type ? In([type]) : undefined,
				rooms: rooms ? +rooms : undefined,
				term: term ? In([term]) : undefined,
				action: action ? In([action]) : undefined,
				bedrooms: beds ? +beds : undefined,
				price: Between(Number(price_from) || 0, Number(price_to) || Infinity),
				floor: Between(Number(floor_from) || 0, Number(floor_to) || 100),
				area: Between(Number(area_from) || 0, Number(area_to) || Infinity),
				repair: repair ? In([repair]) : undefined,
				elevator: elevator ? true : undefined,
				mortgage: mortgage ? true : undefined,
				houseType: house_type ? In([house_type]) : undefined,
			},
		});

		if (!count)
			return send(res, CODES.NO_CONTENT, locales[lang].realties.no_realties);

		const order = sort_by ? (sort_by as string).split('_') : undefined;

		const realties = await realtyRepository.find({
			take,
			skip,
			where: {
				address: ILike(`%${address || ''}%`),
				type: type ? In([type]) : undefined,
				rooms: rooms ? +rooms : undefined,
				term: term ? In([term]) : undefined,
				action: action ? In([action]) : undefined,
				bedrooms: beds ? +beds : undefined,
				price: Between(Number(price_from) || 0, Number(price_to) || Infinity),
				floor: Between(Number(floor_from) || 0, Number(floor_to) || 100),
				area: Between(Number(area_from) || 0, Number(area_to) || Infinity),
				repair: repair ? In([repair]) : undefined,
				elevator: elevator ? true : undefined,
				mortgage: mortgage ? true : undefined,
				houseType: house_type ? In([house_type]) : undefined,
			},
			order: {
				price: order && order[0] === 'PRICE' ? order[1] as any : undefined,
				createdAt: order && order[0] === 'DATE' ? order[1] as any : undefined
			},
			relations: ['images'],
			select: {
				images: {
					id: true,
				},
			},
		});

		if (!realties) return send(res, CODES.NO_CONTENT, locales[lang].realties.no_realties);

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
