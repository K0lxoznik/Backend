import { IUser } from './../db/entity/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createUserJWT = ({ id, name, secondName, bio, avatar, email, password }: IUser): string => {
    return jwt.sign({ id, name, secondName, bio, avatar, email, password }, 'cookies');
}

export const hashPassword = (password: string): Promise<string> => { 
    return bcrypt.hash(password, 10);
}