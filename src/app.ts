import { protect } from './tools/JWT/protect';
import express from 'express';
import morgan from 'morgan';
import AppDataSource from './db';
import authRouter from './routes/Auth';
import userRouter from './routes/User';


const app = express();

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => console.log(error))

app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use(protect);
app.use('/api/user', userRouter);



export default app;
