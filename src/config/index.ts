process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const STAGE = process.env.STAGE || 'dev';

export default {
	STAGE,
	PORT: Number(process.env.PORT),
	DATABASE_URL: String(process.env.DATABASE_URL),
	JWT_SECRET: String(process.env.JWT_SECRET),
	REDIS_URL: String(process.env.REDIS_URL),
};
