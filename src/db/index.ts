import { createConnection } from 'net';
import { DataSource } from 'typeorm';
import config from '../config';
import { Realty } from './entity/Realty';
import { User } from './entity/User';

const AppDataSource = new DataSource({
	ssl: true,
	type: 'postgres',
	url: config.DATABASE_URL,
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
