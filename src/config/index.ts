process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const STAGE = process.env.STAGE || 'dev';

export default {
	STAGE,
	PORT: Number(process.env.PORT),
	DATABASE_HOST: process.env.DATABASE_HOST,
	DATABASE_PORT: Number(process.env.DATABASE_PORT),
	DATABASE_USERNAME: process.env.DATABASE_USERNAME,
	DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
	DATABASE_NAME: process.env.DATABASE_NAME,
	JWT_SECRET: process.env.JWT_SECRET,
};
