import s3 from 's3';
import { unlink, realpathSync } from 'fs';

export default class S3Utils {
	static upload(localFile, remoteFile) {
		const awsConfig = {
			bucket: process.env.AWS_S3_BUCKET,
			prefix: process.env.AWS_S3_PREFIX,
			accessKeyId: process.env.AWS_S3_ACCESS_KEY,
			secretAccessKey: process.env.AWS_S3_SECRET_KEY
		};

		const absolutePath = realpathSync(localFile);

		const params = {
			localFile: absolutePath,
			s3Params: {
				Bucket: awsConfig.bucket,
				Key: remoteFile,
				ACL: 'private'
			}
		};

		const client = s3.createClient({
			maxAsyncS3: 20,
			s3RetryCount: 3,
			s3RetryDelay: 1000,
			multipartUploadThreshold: 20971520,
			multipartUploadSize: 15728640,
			s3Options: {
				region: 'us-west-2',
				useAccelerateEndpoint: true,
				endpoint: 's3-accelerate.amazonaws.com',
				accessKeyId: awsConfig.accessKeyId,
				secretAccessKey: awsConfig.secretAccessKey
			}
		});

		if (remoteFile.includes('.mp4')) {
			params.s3Params.ContentType = 'video/mp4';
		}

		return new Promise((resolve, reject) => {
			const uploader = client.uploadFile(params);

			uploader.on('error', error => {
				reject(error);
				unlink(absolutePath, () => { });
			});

			uploader.on('end', () => {
				resolve(awsConfig.prefix + '/' + remoteFile);
				unlink(absolutePath, () => { });
			});
		});
	}
}
