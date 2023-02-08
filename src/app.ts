import express from 'express';
import morgan from 'morgan';
import client from './db';
import authRouter from './routes/auth';

const app = express();

client.connect((err) => {
	try {
		console.log('Connected to database!');
    } catch (error) {
        console.error('connection error', err.stack);
    }
});

app.use(morgan('dev'));

app.use('/api/auth', authRouter);

export default app;
