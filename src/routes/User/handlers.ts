import { send404Error } from './../../tools/Error/404';
import { send400Error } from './../../tools/Error/400';
import { send401Error } from './../../tools/Error/401';
import { User, IUser } from './../../db/entity/User';
import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../db';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRepository = AppDataSource.manager.getRepository(User);
    const take = Number(req.query.take) || 50;
    const skip = Number(req.query.page) || 0;
    const allUsers:IUser[] = await userRepository.find({ take, skip });
    res.status(200).json(allUsers);
}

export const getOneUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRepository = AppDataSource.manager.getRepository(User);
    const id = req.params.id;
    if (!id) return send400Error(res);
    
    try {
        const user:User | null  = await userRepository.findOneBy({id});
        if (!user) return send404Error(res);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return send400Error(res);
    }
}

export const DeleteOneUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRepository = AppDataSource.manager.getRepository(User);
    const id = req.params.id;
    if (!id) return send400Error(res);

    try { 
        const user:User | null  = await userRepository.findOneBy({id});
        if (!user) return send404Error(res);
        await userRepository.remove(user);
        res.status(200).json({message: 'User deleted'});
    } catch (err) {
        return send400Error(res);
    }
}

export const ChangeUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRepository = AppDataSource.manager.getRepository(User);
    const id = req.params.id;
    if (!id) return send400Error(res);

    try {
        const user: User | null  = await userRepository.findOneBy({id});
        if (!user) return send404Error(res);
        await userRepository.merge(user, req.body);
        const changedData = await userRepository.save(user);
        res.status(201).json({ data: changedData, message: 'Changed'});
    } catch (error: any) {
        return send400Error(res);
    }
}