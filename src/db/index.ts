import { Client } from 'pg';

const client = new Client({
	user: 'serverdb_user',
	password: 'dTusg0kty7a1tyGtpRP0IgEgb31vcCGr',
	host: 'dpg-cfhlppcgqg40klifo9rg-a.frankfurt-postgres.render.com',
	port: 5432,
	database: 'serverdb',
	ssl: true,
});

export default client;
