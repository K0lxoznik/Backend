import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import config from './config';
import { initializeDB } from './db/index';
import authRouter from './routes/Auth';
import imageRouter from './routes/Image';
import locationRouter from './routes/Location';
import realtyRouter from './routes/Realty';
import userRouter from './routes/User';
import { checkLanguage } from './tools/auth/checkLanguage';

const app = express();

initializeDB();

app.use(morgan('dev'));
app.use(cors({ origin: [config.ORIGIN, config.LOCAL_ORIGIN], credentials: true }));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/image', imageRouter);

app.use(checkLanguage);

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/realty', realtyRouter);
app.use('/location', locationRouter);

export default app;
