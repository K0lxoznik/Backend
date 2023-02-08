import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	res.send('Hello auth!');
});

router.get('/signin', (req, res) => {
	res.send('Hello sign in!');
});

router.get('/signup', (req, res) => {
	res.send('Hello sign up!');
});

export default router;
