import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { initializeDB } from './db/index';
import authRouter from './routes/Auth';
import locationRouter from './routes/Location';
import realtyRouter from './routes/Realty';
import userRouter from './routes/User';

const app = express();

initializeDB();

app.use(cors({ origin: ['http://localhost:3000'] }));
app.use(express.json(), morgan('dev'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/realty', realtyRouter);
app.use('/api/location', locationRouter);

export default app;
