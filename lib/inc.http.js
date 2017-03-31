const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');

const debug = false;

const hyperTextTransfer = {
	'http:': http,
	'https:': https
};

const patterns = [
	'://',
	'http://',
	'https://'
];

const request = options => new Promise((resolve, reject) => {
	console.log();
	console.log(`${options.path}`);

	let responseBody = '';

	if (debug) {
		console.log();
		console.log('OPTIONS');
		console.log('-------');
		console.log((JSON.stringify(options)));
	}

	const handleResponse = response => {
		response.setEncoding('utf8');

		if (debug) {
			console.log();
			console.log('RESPONSE_HEADERS');
			console.log('----------------');
			console.dir(response.headers);

			console.log();
			console.log('STATUS_CODE');
			console.log('-----------');
			console.log(response.statusCode);
		}

		response.on('data', chunk => {
			responseBody += chunk.toString();
			if (debug) {
				console.log('chunk: ', chunk.toString());
			}
		});

		response.on('end', () => {
			if (debug) {
				console.log();
				console.log('RESPONSE_BODY');
				console.log('-------------');
				console.log(responseBody);
			}
			resolve(responseBody);
		});

		response.on('error', err => {
			console.error(err);
			reject(err);
		});
	};

	const req = hyperTextTransfer[options.protocol].request(options, handleResponse);
	req.end();
});

const match = requestUrl => patterns.some(pattern => {
	const segment = requestUrl.substr(0, pattern.length);

	if (segment === pattern) {
		return true;
	}
});

const plugin = (plugin, markserv) => requestUrl => new Promise(resolve => {
	if (!match(requestUrl)) {
		requestUrl = markserv.httpServerUrl + path.normalize('/' + requestUrl);
	}

	markserv.log.info(`markserv-contrib-inc.http request: ${requestUrl}`);

	const ref = url.parse(requestUrl);

	const protocol = ref.protocol;
	const host = ref.hostname;
	const port = ref.port;
	const _path = ref.path;

	const options = {
		protocol,
		host,
		port,
		path: _path,
		method: 'GET',
		headers: {}
	};

	return request(options)
	.then(response => {
		resolve(response);
	})
	.catch(err => {
		console.error(err);
		resolve(`<div><!--markserv-http-not-found:${requestUrl}--></div>`);
	});
});

module.exports = {
	name: 'markserv-contrib-inc.http',
	plugin
};
