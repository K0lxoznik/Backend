import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth';

const app = express();

app.use(morgan('dev'));
app.use('/auth', authRouter);

export default app;
