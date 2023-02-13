import { protect, protectAuth } from './tools/JWT/protect';
import express from 'express';
import morgan from 'morgan';
import AppDataSource from './db';
import authRouter from './routes/Auth';
import userRouter from './routes/User';
import realtyRouter from './routes/Realty';
import locationRouter from './routes/Location';

const app = express();

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => console.log(error))

app.use(morgan('dev'));
app.use('/api/auth', authRouter);
app.use('/api/user', protectAuth, userRouter);
app.use('/api/realty', protectAuth, realtyRouter);
app.use('/api/location', protect, locationRouter)

export default app;
