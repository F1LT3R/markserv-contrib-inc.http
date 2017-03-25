const request = require('request')

const plugin = (plugin, markserv) => requestUrl => new Promise((resolve, reject) => {
			console.log('that thing')
	if (requestUrl.indexOf('//') === 0) {
		requestUrl = markserv.httpServerUrl + '/' + requestUrl.substr(2)
	}

	console.log(requestUrl)

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
