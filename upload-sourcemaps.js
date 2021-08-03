const fs = require('fs');
const dotenv = require('dotenv');
const { node } = require('@bugsnag/source-maps');

const uploadSourceMaps = () => {
	return new Promise(resolve => {
		const env = dotenv.config();

		node.uploadMultiple({
			apiKey: env.parsed.BUGSNAG_KEY,
			directory: './build',
			overwrite: true,
			detectAppVersion: true
		}).then(resolve)
			.catch(resolve);
	});
};

const removeSourceMaps = path => {
	if (fs.existsSync(path)) {
		const files = fs.readdirSync(path);

		if (files.length) {
			files.forEach(filename => {
				if (fs.statSync(`${path}/${filename}`).isDirectory()) {
					removeSourceMaps(`${path}/${filename}`);
				} else if (/.js.map$/.test(filename)) {
					fs.unlinkSync(`${path}/${filename}`);
				}
			});
		}
	}
};

const removeSourceMapsPromise = () => {
	return new Promise(resolve => {
		removeSourceMaps('./build');
		resolve();
	});
};

return uploadSourceMaps()
	.then(removeSourceMapsPromise)
	.then(() => process.exit(0));
