import app from './app';

const PORT = process.env.PORT || 2999;

app.listen(PORT, () => {
	console.log(`Server listen  ${PORT}`);
});
