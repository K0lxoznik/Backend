export default {
	PORT: Number(process.env.PORT),
	DATABASE_PORT: Number(process.env.DATABASE_PORT),
	DATABASE_URL: String(process.env.DATABASE_URL),
	JWT_SECRET: String(process.env.JWT_SECRET),
};
