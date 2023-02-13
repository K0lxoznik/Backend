import { send404Error } from './../../tools/Error/404';
import { send400Error } from './../../tools/Error/400';
import { send401Error } from './../../tools/Error/401';
import { Realty, IRealty } from './../../db/entity/Realty';
import { User, IUser } from './../../db/entity/User';
import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../db';

export const getAllRealties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const realtyRepository = AppDataSource.manager.getRepository(Realty);
    const take = Number(req.query.take) || 50;
    const skip = Number(req.query.page) || 0;
    const allRealties: IRealty[] = await realtyRepository.find({ take, skip });
    res.status(200).json(allRealties);
}

export const createUserRealty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.params.userId) return send400Error(res);
    const userRepository = AppDataSource.manager.getRepository(User);
    const user: User | null = await userRepository.findOneBy({ id: req.params.userId });
    if (!user) return send404Error(res);    
    const realtyRepository = AppDataSource.manager.getRepository(Realty);
    const realty = realtyRepository.create({ ...req.body, user })
    await realtyRepository.save(realty);
    res.status(200).json({ realty });
}