var socketio = require('socket.io'),
	io,
	guestNumber = 1,
	nickNames = {},
	namesUsed = [],
	currentRoom = {};

	exports.listen = function(server){
		io = socketio.listen(server);
		io.set('log level', 1);
		io.sockets.on('connection', function(socket){
			guestNumber = assignGuestName(socket, guestNumber, Nicknames, namesUsed);
			joinRoom(socket, 'Lobby');
			handleMessageBroadcasting(socket, nickNames);
			handleNameChangeAttempts(socket, nicknames, nameUsed);
			handleRoomJoining(socket);
			socket.on('rooms', function(){
				socket.emit('rooms', io.socket.manager.rooms);
			});
			handleClientDisconnection(socket, nickNames, nameUsed);
		});
	}