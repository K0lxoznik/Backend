import { comparePassword } from '../../tools/JWT/jwt';
import { send404Error } from '../../tools/Error/404';
import { createUserJWT, hashPassword } from '../../tools/JWT/jwt';
import { NextFunction, Request, Response } from 'express';
import AppDataSource from '../../db';
import { User } from '../../db/entity/User';
import { send401Error } from '../../tools/Error/401';

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
	const userRepository = AppDataSource.manager.getRepository(User);
    const firstUser = await userRepository.findOneBy( { email: req.body.email } );
    if (!firstUser) {
        return send404Error(res);
    }
    const compered = await comparePassword(req.body.password, firstUser.password);
    if (!compered) {
        return send401Error(res);
    }
    const token = createUserJWT(firstUser);
    res.json({ token });
};