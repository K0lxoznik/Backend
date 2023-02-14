import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../db/entities/User';

/** ## Create JWT Token
 * The createJWT function creates a JWT token
 * @param user User
 * @returns jwt token
 */
export const createJWT = (user: User) => {
	const { id, name, secondName, bio, avatar, email, password } = user;
	return jwt.sign({ id, name, secondName, bio, avatar, email, password }, 'cookies');
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
