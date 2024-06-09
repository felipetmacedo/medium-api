import * as dotenv from "dotenv";

dotenv.config();

export const config = {
	database: {
		dbname: process.env.DB_NAME,
		master: {
			host: process.env.DB_HOST,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			pool: {
				max: 5,
			},
		},
		read: [
			{
				host: process.env.DB_REPLICA_HOST || process.env.DB_HOST,
				username: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				pool: {
					max: 10,
				},
			},
		],
	},
};
