var cache = {};

var mime = require('mime'),
	path = require('path'),
	http = require('http'),
	fs = require('fs');

function send404(res){
	res.writeHead(404, {"Content-Type":"text/plain"});
	res.write("404: resource not found");
	res.end();
}

function sendFile(res, filePath, fileCont){
	res.writeHead(200, {"Content-Type": mime.lookup(path.basename(filePath))});
	res.end(fileCont);
}

function serveStatic(res, absPath, cache){
	if(cache[absPath]){
		var data = cache[absPath];
		sendFile(res, absPath, data);
		return;
	}
	fs.exists(absPath, function(exist){
		
		if(exist){
			fs.readFile(absPath, function(err, fileData){
				if(err){
					send404(res);
					return;
				}
				cache[absPath] = fileData;
				sendFile(res, absPath, fileData);
			});
		}
	})

}



var server = http.createServer(function(req, res){
	if(req.url == "/"){
		serveStatic(res, 'public/index.html', cache);
	} else {
		serveStatic(res, 'public'+req.url, cache);
	}
});

server.listen(3000);

var chat_server = require('/lib/chat_server');
chat_server.listen(server);
