import { createClient } from 'redis';
import { LoggerUtils } from '@utils';
import { config } from '../config/config';

class CacheModule {
	static getInstance() {
		return CacheModule._instance;
	}

	connect() {
		if (!config.redis.host) {
			return Promise.resolve();
		}

		CacheModule._instance = createClient({
			host: config.redis.host,
			port: 6379
		});

		return new Promise((resolve, reject) => {
			CacheModule._instance.on('error', err => {
				reject(err);
				LoggerUtils.error('Redis Client Error', err);
			});
			CacheModule._instance.on('connect', () => {
				resolve();
				LoggerUtils.success('Redis is connected');
			});
		});
	}

	static _isConnected() {
		return (CacheModule._instance && CacheModule._instance.connected);
	}

	static set(key, value, ex) {
		if (!CacheModule._isConnected()) {
			return null;
		}

		const threeHours = 60 * 60 * 3;

		const expire = ex || threeHours;

		return CacheModule._instance.set(key, value, 'ex', expire);
	}

	static del(key) {
		if (!CacheModule._isConnected()) {
			return;
		}

		CacheModule._instance.del(key);
	}

	static async get(key) {
		return new Promise(resolve => {
			if (!CacheModule._isConnected()) {
				resolve(null);
				return;
			}

			CacheModule._instance.get(key, (err, resp) => {
				if (resp) {
					resolve(resp);
					return;
				}

				resolve(null);
			});
		});
	}

	static async getParsed(key) {
		try {
			const response = await CacheModule.get(key);

			return JSON.parse(response);
		} catch (error) {
			return Promise.reject();
		}
	}

	disconnect() {
		if (!CacheModule._isConnected()) {
			return Promise.resolve();
		}

		LoggerUtils.success('Redis is disconnected');
		CacheModule._instance.connected = false;

		return CacheModule._instance.quit();
	}
}

export default CacheModule;
