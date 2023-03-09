import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import { initializeDB } from './db/index';
import authRouter from './routes/Auth';
import locationRouter from './routes/Location';
import realtyRouter from './routes/Realty';
import userRouter from './routes/User';
import { checkLanguage } from './tools/auth/checkLanguage';

const app = express();

initializeDB();

app.use(
	cors({ origin: ['http://localhost:3000', 'https://doom-ru.vercel.app'] }),
	express.json(),
	morgan('dev'),
	checkLanguage,
);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/realty', realtyRouter);
app.use('/api/location', locationRouter);

export default app;
