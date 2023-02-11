import { createUserJWT, hashPassword } from './../tools/jwt';
import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../db';
import { User } from '../db/entity/User';

export const signUpUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const user = new User();
    user.name = req.body.name;
    user.secondName = req.body.secondName;
    user.email = req.body.email;
    user.password = await hashPassword(req.body.password);
    user.bio = req.body.bio;
    user.avatar = req.body.avatar;
    await AppDataSource.manager.save(user);
    const token = createUserJWT(user); 
    res.status(201).json({ token });
};

export const signInUser = async (req: Request, res: Response): Promise<void> => {
	
};