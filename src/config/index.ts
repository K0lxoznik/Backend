export default {
	PORT: Number(process.env.PORT),
	DATABASE_PORT: Number(process.env.DATABASE_PORT),
	DATABASE_URL: String(process.env.DATABASE_URL),
	JWT_SECRET: String(process.env.JWT_SECRET),
	REDIS_URL: String(process.env.REDIS_URL),
	SEND_EMAIL: String(process.env.SEND_EMAIL),
	SEND_PASSWORD: String(process.env.SEND_PASSWORD),
	ORIGINS: [String(process.env.LOCAL_ORIGIN), String(process.env.ORIGIN)],
};
