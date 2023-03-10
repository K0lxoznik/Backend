export default {
	PORT: Number(process.env.PORT),
	DATABASE_PORT: Number(process.env.DATABASE_PORT),
	DATABASE_URL: String(process.env.DATABASE_URL),
	JWT_SECRET: String(process.env.JWT_SECRET),
	REDIS_URL: String(process.env.REDIS_URL),
	SEND_EMAIL: String(process.env.SEND_EMAIL),
	SEND_PASSWORD: String(process.env.SEND_PASSWORD),
	DOMAIN:
		process.env.NODE_ENV === 'production'
			? String(process.env.PUBLIC_DOMAIN)
			: String(process.env.LOCAL_DOMAIN),
};
