import { Client } from 'pg';

const client = new Client({
	user: 'doomru_user',
	password: 'x2B6Ds6DdErzBtVqlnufDznbdyqgqWvu',
	host: 'dpg-cfhkodkgqg40kli5024g-a.frankfurt-postgres.render.com',
	port: 5432,
	database: 'doomru',
	ssl: true,
});

export default client;
