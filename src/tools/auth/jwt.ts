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
	const { id, name, secondName, phone, city, bio, avatar, email, password, isActivated } = user;

	return jwt.sign(
		{
			id,
			name,
			secondName,
			bio,
			avatar,
			city,
			email,
			password,
			phone,
			isActivated,
		},
		config.JWT_SECRET,
		{
			expiresIn: rememberMe ? '30d' : '7d',
		},
	);
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
