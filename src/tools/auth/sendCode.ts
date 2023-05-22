import nodemailer from 'nodemailer';
import config from '../../config';

const sendCode = async (email: string, code: number) => {
	try {
		let transporter = nodemailer.createTransport({
			service: 'yandex',
			host: 'smtp.yandex.ru',
			port: 465,
			secure: true,
			auth: {
				user: config.SEND_EMAIL,
				pass: config.SEND_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: config.SEND_EMAIL,
			to: email,
			subject: 'DOOM.RU | Verify email',
			text: `Your code: ${code}`,
			html: `<h1>Your code: ${code}</h1>`,
		});
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export default sendCode;
