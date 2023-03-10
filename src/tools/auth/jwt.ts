import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { User } from '../../db/entity/User';

/** ## Create JWT Token
 * The createJWT function creates a JWT token
 * @param user User
 * @returns jwt token
 */
export const createJWT = (user: User, rememberMe = false) => {
	const { id, name, secondName, bio, avatar, email, password } = user;
	return jwt.sign({ id, name, secondName, bio, avatar, email, password }, config.JWT_SECRET, {
		expiresIn: rememberMe ? '20d' : '15m',
	});
};

/** ## Hash Password
 * The hashPassword function hashes the password
 * @param password string
 * @returns hashed password
 */
export const hashPassword = (password: string) => {
	return bcrypt.hash(password, 10);
};

/** ## Compare Two Passwords
 * The comparePassword function compares the password with the hash
 * @param password string
 * @param hash string
 * @returns boolean
 */
export const comparePassword = (password: string, hash: string) => {
	return bcrypt.compare(password, hash);
};
