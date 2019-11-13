var http = require('http');
var urlD = require('url');
http.createServer(onrequest).listen(3000);

function onrequest(request, response) {
	var oUrl = urlD.parse(request.url, true);
	
	if (!oUrl.query.url) {
		response.statusCode = 404;
		response.end("404");
		return;
	}
	
	if (!oUrl.query.url.includes("http")) {
		response.statusCode = 404;
		response.end("404!");
		return;
	}
	
	var rUrl = urlD.parse(oUrl.query.url);
	var rHostname = rUrl.hostname;
	if (rUrl.port) {
		var rPort = rUrl.port;
	} else {
		var rPort = 80
	}
	var rPath = rUrl.path;

	var options = {
		hostname: rHostname,
		port: rPort,
		path: rPath,
	};

	var proxy = http.request(options, function (res) {
		response.writeHead(res.statusCode, res.headers)
		res.pipe(response, {
			end: true
		});
	});

	request.pipe(proxy, {
		end: true
	});
}