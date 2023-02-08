import express from 'express';
import morgan from 'morgan';
import client from './db';
import authRouter from './routes/auth';

const app = express();

client.connect((err) => {
	if (err) console.error('connection error', err.stack);
	else console.log('Connected to database!');
});

app.use(morgan('dev'));
app.use('/api/auth', authRouter);

export default app;
