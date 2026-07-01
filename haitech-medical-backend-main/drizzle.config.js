import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/schema/index.js',
	out: './drizzle',
	dbCredentials: {
		host: process.env.POSTGRES_HOST,
		port: Number(process.env.POSTGRES_PORT) || 5432,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASS,
		database: process.env.POSTGRES_DB,
		ssl: false,
	},
});
