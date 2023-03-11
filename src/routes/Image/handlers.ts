import { Request, Response } from 'express';
import { pipeline, Readable } from 'stream';
import AppDataSource from '../../db';
import { Image } from '../../db/entity/Image';
import locales from '../../locales';
import { send } from '../../tools/codes';
import { CODES } from '../../tools/codes/types';
import { Language } from '../../types';

export const getOneImage = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const lang = req.lang as Language;
		const imageRepository = AppDataSource.getRepository(Image);
		const image = await imageRepository.findOneBy({ id: req.params.id });
		if (!image) return send(res, CODES.NOT_FOUND, locales[lang].image.no_image);

		const readStream = new Readable();
		readStream.push(image.data);
		readStream.push(null);

		res.set({
			'Content-Type': 'image/webp',
			'Content-Length': image.data.length,
		});

		pipeline(readStream, res, console.log);
	} catch (error: any) {
		send(res, CODES.INTERNAL_SERVER_ERROR, error.message);
	}
};
