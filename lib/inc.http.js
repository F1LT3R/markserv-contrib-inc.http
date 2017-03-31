const request = require('request')

const patterns = [
	'://',
	'http://',
	'https://'
]

const plugin = (plugin, markserv) => requestUrl => new Promise((resolve, reject) => {
	if (patterns.indexOf(requestUrl.substr(0, 2))) {
		requestUrl = markserv.httpServerUrl + '/' + requestUrl
	}

	markserv.log.trace(`markserv-contrib-mod.http: ${requestUrl}`)

	request({
		uri: requestUrl
	}, (error, response, body) => {
		if (!body) {
			return reject(false)
		}

		if (response.statusCode === 200) {
			resolve(body)
		}
	})
})

module.exports = {
	name: 'markserv-contrib-inc.http',
	plugin
}
