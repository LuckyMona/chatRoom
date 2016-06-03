var http = require("http"),
	fs = require("fs"),
	path = require("path"),
	mime = require("mime"),
	cache = {};

	function send404(res){
		res.writeHead(404,{ "Content-Type":"text/plain" });
		res.write("404: resource not found");
		res.end();
	}
	function sendFile(res, filePath, fileCont){
		res.writeHead(200, {"Content-Type":mime.lookup(path.basename(filePath))});
		res.end(fileCont);
	}