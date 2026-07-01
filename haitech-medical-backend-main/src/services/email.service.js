import { logger, env } from '../config/index.js';

const isSmtpReady = () => !!(env.SMTP?.HOST && env.SMTP?.USER && env.SMTP?.PASS);

const send = async (options) => {
	if (!isSmtpReady()) {
		logger.info(`[EMAIL] SMTP not configured — would send "${options.subject}" to ${options.to}`);
		return;
	}
	try {
		// Dynamic import: run `npm install nodemailer` in the backend to activate real email
		const { default: nodemailer } = await import('nodemailer');
		const transporter = nodemailer.createTransport({
			host: env.SMTP.HOST,
			port: env.SMTP.PORT || 587,
			secure: env.SMTP.SECURE || false,
			auth: { user: env.SMTP.USER, pass: env.SMTP.PASS },
		});
		await transporter.sendMail({ from: env.SMTP.FROM || '"Haitech Medical" <no-reply@haitechmedical.com.au>', ...options });
	} catch (err) {
		logger.error(`[EMAIL] Failed to send to ${options.to}: ${err.message}`);
	}
};

const getBaseUrl = () => env.FRONTEND_URL || 'http://localhost:3000';

export const sendPasswordResetEmail = async (email, token) => {
	const url = `${getBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;
	await send({
		to: email,
		subject: 'Reset your Haitech Medical password',
		html: `
			<h2>Password Reset</h2>
			<p>Click the link below to reset your password. This link expires in 30 minutes.</p>
			<p><a href="${url}" style="background:#1fb6cd;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Reset Password</a></p>
			<p>If you didn't request this, please ignore this email.</p>
			<p style="color:#999;font-size:12px">${url}</p>
		`,
	});
};

export const sendVerificationEmail = async (email, token) => {
	const url = `${getBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;
	await send({
		to: email,
		subject: 'Verify your Haitech Medical email',
		html: `
			<h2>Email Verification</h2>
			<p>Click the link below to verify your email address.</p>
			<p><a href="${url}" style="background:#1fb6cd;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Verify Email</a></p>
			<p style="color:#999;font-size:12px">${url}</p>
		`,
	});
};

export const sendOrderConfirmationEmail = async (email, orderId) => {
	const url = `${getBaseUrl()}/account/orders/${orderId}`;
	await send({
		to: email,
		subject: 'Your Haitech Medical order is confirmed',
		html: `
			<h2>Order Confirmed</h2>
			<p>Thank you for your order! Our team will contact you within 24 hours.</p>
			<p><a href="${url}" style="background:#1fb6cd;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">View Order</a></p>
		`,
	});
};

const emailService = { sendPasswordResetEmail, sendVerificationEmail, sendOrderConfirmationEmail };
export default emailService;
