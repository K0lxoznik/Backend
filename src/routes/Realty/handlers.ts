import { Request, Response } from 'express';
import fetch from 'node-fetch';
import sharp from 'sharp';
import { Between, FindOptionsOrderValue, ILike, In } from 'typeorm';
import { AppDataSource } from '../../db';
import { Image } from '../../db/entity/Image';
import { Realty } from '../../db/entity/Realty';
import { User } from '../../db/entity/User';
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

		if (!totalCount) return send(res, CODES.NO_CONTENT, locales[lang].realties.no_realties);

		const count = await realtyRepository.count({
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
		});

		if (!count) return send(res, CODES.NO_CONTENT, locales[lang].realties.no_realties);

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
				createdAt:
					order && order[0] === 'DATE' ? (order[1] as FindOptionsOrderValue) : undefined,
			},
			relations: ['images', 'user'],
			select: {
				images: {
					id: true,
				},
				user: {
					id: true,
				},
			},
		});

		if (!realties) return send(res, CODES.NO_CONTENT, locales[lang].realties.no_realties);

		if (!order || order[0] !== 'PRICE')
			return send(res, CODES.OK, locales[lang].realties.found, realties, {
				count,
				take,
				page,
			});

		const response = await fetch(
			`${process.env.EXCHANGE_API_URL}/latest?symbols=RUB&base=USD`,
			{
				method: 'GET',
				headers: {
					apikey: String(process.env.EXCHANGE_API_KEY),
				},
			},
		);

		const data: any = await response.json();

		const sortedByPriceResult = realties.sort((a, b) => {
			const formattedPriceA = a.currency === 'USD' ? a.price * data.rates.RUB : a.price;
			const formattedPriceB = b.currency === 'USD' ? b.price * data.rates.RUB : b.price;

			return order[1] === 'ASC'
				? formattedPriceA - formattedPriceB
				: formattedPriceB - formattedPriceA;
		});

		send(res, CODES.OK, locales[lang].realties.found, sortedByPriceResult, {
			count,
			take,
			page,
		});
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
			relations: ['images', 'user'],
			select: {
				images: {
					id: true,
				},
				user: {
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
		const realty = await realtyTable.findOne({
			where: { id: +req.params.id },
			relations: ['images', 'user'],
			select: {
				images: {
					id: true,
				},
				user: {
					id: true,
				},
			},
		});
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

export const addRealtyToFavorite = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const realtyId = Number(req.params.realtyId);
		const realtyRepository = AppDataSource.getRepository(Realty);
		const realty = await realtyRepository.findOneBy({ id: Number(realtyId) });

		if (!realty) return send(res, CODES.NOT_FOUND, locales[lang].realties.no_realty);

		// @ts-ignore
		const { id } = req.user as User;
		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOneBy({ id });

		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].auth.incorrect_data);
		if (user?.favorites.includes(realtyId))
			return send(res, CODES.BAD_REQUEST, locales[lang].realties.realty_is_already_favorite);

		user?.favorites.push(realtyId);
		await userRepository.save(user);
		send(res, CODES.OK, locales[lang].realties.added_to_favorites, user.favorites);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const getFavoriteRealties = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		// @ts-ignore
		const { id } = req.user as User;
		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOneBy({ id });

		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].auth.incorrect_data);

		if (!user.favorites.length)
			return send(res, CODES.OK, locales[lang].realties.no_favorites, []);

		const realtyRepository = AppDataSource.getRepository(Realty);

		const favoriteRealties = await realtyRepository.find({
			where: {
				id: In(user.favorites.map(Number)),
			},
			relations: ['images', 'user'],
			select: {
				images: {
					id: true,
				},
				user: {
					id: true,
				},
			},
		});

		if (!favoriteRealties.length)
			return send(res, CODES.BAD_REQUEST, locales[lang].realties.deleted, []);

		send(res, CODES.OK, locales[lang].realties.found_favorites, favoriteRealties);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const getMyRealties = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		// @ts-ignore
		const { id } = req.user as User;
		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOne({
			where: { id },
			relations: ['realties'],
			select: {
				realties: {
					id: true,
				},
			},
		});

		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].auth.incorrect_data);

		if (!user.realties.length)
			return send(res, CODES.OK, locales[lang].realties.no_realties, []);

		const realtyRepository = AppDataSource.getRepository(Realty);
		const myRealties = await realtyRepository.find({
			where: {
				user: {
					id,
				},
			},
			relations: ['images', 'user'],
			select: {
				images: {
					id: true,
				},
				user: {
					id: true,
				},
			},
		});

		if (!myRealties.length)
			return send(res, CODES.BAD_REQUEST, locales[lang].realties.deleted, []);

		send(res, CODES.OK, locales[lang].realties.found, myRealties);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const removeRealtyFromFavorite = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		// @ts-ignore
		const { id } = req.user as User;
		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOneBy({ id });

		if (!user) return send(res, CODES.NOT_FOUND, locales[lang].auth.incorrect_data);
		if (!user.favorites.length) return send(res, CODES.OK, locales[lang].realties.no_favorites);

		const { realtyId } = req.params;
		user.favorites = user.favorites.filter((id) => id !== Number(realtyId));
		await userRepository.save(user);
		send(res, CODES.OK, locales[lang].realties.removed_from_favorites, user.favorites);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
