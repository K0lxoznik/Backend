import * as dotenv from 'dotenv';
dotenv.config();

import config from './config';
import app from './app';
const PORT = config.PORT;

app.listen(PORT, () => {
	console.log(`Server listen  ${PORT}`);
});
