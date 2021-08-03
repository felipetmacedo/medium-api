import AWS from 'aws-sdk';
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer';

export default class FileUtils {
	static parseRemotePath(remoteFile) {
		return remoteFile.startsWith('https://') ? unescape(decodeURI(remoteFile.split('/').slice(3).join('/'))) : remoteFile;
	}

	static upload(options) {
		let file;

		const s3 = new AWS.S3({
			accessKeyId: process.env.AWS_S3_ACCESS_KEY,
			secretAccessKey: process.env.AWS_S3_SECRET_KEY
		});

		try {
			if (options.buffer) {
				file = options.buffer;
			} else if (options.path) {
				file = readFileSync(options.path, 'utf-8');
			}

			return new Promise((resolve, reject) => s3.upload({
				Bucket: process.env.AWS_S3_BUCKET,
				Key: options.remote_path,
				Body: file,
				Tagging: options.tagging ? this.toString(options.tagging) : ''
			}, (error, data) => data ? resolve(data.Location) : reject(error)));
		} catch (error) {
			return null;
		}
	}

	static sign(options) {
		const s3 = new AWS.S3({
			accessKeyId: process.env.AWS_S3_ACCESS_KEY,
			secretAccessKey: process.env.AWS_S3_SECRET_KEY
		});

		return new Promise((resolve, reject) => {
			s3.getSignedUrl('getObject', {
				Bucket: process.env.AWS_S3_BUCKET,
				Key: this.parseRemotePath(options.remote_path),
				Expires: options.expires
			}, (error, url) => url ? resolve(url) : reject(error));
		});
	}

	static async generatePDF(content, options = {}) {
		const browser = await puppeteer.launch({
			executablePath: process.env.CHROMIUM_PATH,
			ignoreDefaultArgs: ['--disable-extensions'],
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});

		const page = await browser.newPage();

		await page.goto(`data:text/html,${encodeURIComponent(content)}`, {
			timeout: 0,
			waitUntil: 'networkidle0'
		});

		const buffer = await page.pdf(options.pdf);

		await browser.close();

		await this.upload({ ...options, buffer });

		return this.sign(options);
	}
}
