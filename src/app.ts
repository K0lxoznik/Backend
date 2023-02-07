import express, { Request, Response } from 'express';
import authRouter from './routes/auth';

const app = express();

app.use('/auth', authRouter);

export default app;