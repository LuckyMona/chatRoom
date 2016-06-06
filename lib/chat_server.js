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

	function assignGuestName(socket, guestNumber, Nicknames, namesUsed){
		var name = 'Guest'+guestNumber;
		nickNames[socket.id] = name;
		socket.emit('nameResult', {
			success:true,
			name:name
		});
		nameUsed.push(name);
		return guestNumber+1;

	}

	function joinRoom(socket, room){
		socket.join(room);
		currentRoom[socket.id] = room;
		socket.emit('joinResult', {room:room});
		socket.broadcasting.to(room).emit('message',{
			text:nickNames[socket.id] + 'has joined' + room +':';
		});
		var usersInRoom = io.sockets.clients(room);
		if(usersInRoom.length > 1){
			var usersInRoomSummary = 'Users currently in '+room +':';
			for(var index in usersInRoom){
				var userSocketId = usersInRoom[index].id;
				if(userSocketId != socket.id){
					if(index>0){
						usersInRoomSummary += ',';
					}
				}
				usersInRoom += nickNames[userSocketId];
			}
		}
		usersInRoomSummary += '.';
		socket.emit('message', { text: usersInRoomSummary});
	}

	function handleNameChangeAttempts(socket, nickNames, nameUsed){
		socket.on('nameAttempt', function(name){
			if(name.indexof('Guest') == 0 ){
				socket.emit('nameResult', {
					success:false,
					message:'Names can not begin with "Guest".'
				});
			} else {
				if(nameUsed.indexOf(name) == -1){
					var previousName = nickNames[socket.id];
					var previousNameIndex = usedName.indexOf(previousName);
					nameUsed.push(name);
					nickNames[socket.id] = name;
					delete nameUsed[previousNameIndex];
					socket.emit('nameResult',{
						success:true,
						name:name
					});
					socket.broadcast.to(currentRoom[socket.id]).emit('message',{
						text:previousName +'is known as'+name+'.';
					})
				} else {
					socket.emit('nameResult',{
						success:false,
						message:"That name is already in use"
					});
				}
			}
		});
	}
	function handleMessageBroadcasting(socket){
		socket.on('message', function(message){
			socket.broadcast.to(message.room).emit('message',{
				text:nicknames[socket.id] +':' + message.text;
			})
		})
	}
	function handleRoomJoining(socket){
		socket.on('join', function(room){
			socket.leave(currentRoom[socket.id]);
			joinRoom(socket, room.newRoom);
		})
	}

	function handleClientDisconnection(socket){
		socket.on('disconnect', function(){
			var nameIndex = nameUsed.indexOf(nickNames[socket.id]);
			delete nameUsed[nameIndex];
			delete nickNames[socket.id];
		});
	}