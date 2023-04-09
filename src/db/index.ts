import { DataSource } from 'typeorm';
import config from '../config';
import { Image } from './entity/Image';
import { Realty } from './entity/Realty';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
	ssl: true,
	type: 'postgres',
	url: config.DATABASE_URL,
	port: config.DATABASE_PORT,
	synchronize: true,
	logging: true,
	entities: [User, Realty, Image],
	migrations: [],
	subscribers: [],
});

export const initializeDB = () => {
	AppDataSource.initialize()
		.then(() => console.log('Database initialized'))
		.catch((error: any) => console.log(error));
};
