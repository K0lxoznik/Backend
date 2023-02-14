import { DataSource } from 'typeorm';
import config from '../config';
import { Realty } from './entities/Realty';
import { User } from './entities/User';

const AppDataSource = new DataSource({
	ssl: true,
	type: 'postgres',
	host: config.DATABASE_HOST,
	port: config.DATABASE_PORT,
	username: config.DATABASE_USERNAME,
	password: config.DATABASE_PASSWORD,
	database: config.DATABASE_NAME,
	synchronize: true,
	logging: true,
	entities: [User, Realty],
	subscribers: [],
	migrations: [],
});

export const initializeDB = () => {
	AppDataSource.initialize()
		.then(() => console.log('Database initialized'))
		.catch((error: any) => console.log(error));
};

export default AppDataSource;
