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

	function serveStatic(res, cache, absPath){
		if(cache[absPath]){
			sendFile(res, absPath, cache[absPath]);
			return;
		}
		fs.exists(absPath, function(exists){
			if(exists){
				fs.readFile(absPath, function(err,data){
					if(err){
						send404(res);
						return;
					}
					cache[absPath] = data;
					sendFile(res, absPath, data);
				})
				return;
			}
			send404(res);
		})
	}

	var server = http.createServer(function(req, res){
		var filePath = false;
		if(req.url == "/"){
			filePath = 'public/index.html';
		} else {
			filePath = "public/" + req.url;
		}
		var absPath = './'+filePath;
		serveStatic(res, cache, absPath);
	})

	server.listen(3000, function(){
		console.log("server listening on port 3000")
	});
