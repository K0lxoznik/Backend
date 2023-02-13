import { send404Error } from './../Error/404';
import { User } from './../../db/entity/User';
import  jwt from 'jsonwebtoken';
import { send401Error } from './../Error/401';
import { Response, NextFunction } from 'express';
import AppDataSource from '../../db';

export const protect = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const bearer = req.headers.authorization;
    if (!bearer) return send401Error(res);

    const token = bearer.split(' ')[1];
    if (!token) return send401Error(res);

    try {
        const payload: any = jwt.verify(token, 'cookies');
        req.user = payload;
        next();
    } catch (error: any) {
        return send401Error(res);
    }
};

export const protectAuth = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const bearer = req.headers.authorization;
    if (!bearer) return send401Error(res);

    const token = bearer.split(' ')[1];
    if (!token) return send401Error(res);

    try {
        const userRepository = AppDataSource.manager.getRepository(User);
        const user: User | null = await userRepository.findOneBy( { id: req.params.id } );
        if (!user) return send404Error(res);
        const payload: any = jwt.verify(token, 'cookies');
        if (!payload || payload.id !== user.id) return send401Error(res);
        req.user = payload;
        next();
    } catch (error: any) {
        return send401Error(res);
    }
};