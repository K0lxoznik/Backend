import { DataSource } from 'typeorm'
import { Realty } from './entity/Realty'
import { User } from './entity/User'
const AppDataSource = new DataSource({
    ssl: true,
    type: 'postgres',
    host: 'dpg-cfhlppcgqg40klifo9rg-a.frankfurt-postgres.render.com',
    port: 5432,
    username: 'serverdb_user',
    password: 'dTusg0kty7a1tyGtpRP0IgEgb31vcCGr',
    database: 'serverdb',
    synchronize: true,
    logging: true,
    entities: [User, Realty],
    subscribers: [],
    migrations: [],
})

export default AppDataSource


