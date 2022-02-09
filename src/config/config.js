import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
	database: {
		dbname: process.env.DB_NAME,
		master: {
			host: process.env.DB_HOST,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			pool: {
				max: 5
			}
		},
		read: [{
			host: process.env.DB_REPLICA_HOST || process.env.DB_HOST,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			pool: {
				max: 10
			}
		}]
	},
	aws: {
		bucket: process.env.AWS_S3_BUCKET,
		prefix: process.env.AWS_S3_PREFIX,
		accessKeyId: process.env.AWS_S3_ACCESS_KEY,
		secretAccessKey: process.env.AWS_S3_SECRET_KEY,
		region: 'us-west-2'
	}
};
