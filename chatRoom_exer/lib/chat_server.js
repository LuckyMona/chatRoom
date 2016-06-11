var ioServer = require('socket.io'),
	guestNumber = 1,
	nickNames = {},
	namesUsed = [],
	currentRooms = {},

export.listen = function(server){
	var io = ioServer.listen(server);
	io.set('log level', 1);

	io.on('connection', function(socket) {
	guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
	joinRoom(socket, 'Lobby');
	handleMessageBroadcasting(socket, message);
	//handleChangingName(socket, );
	socket.on('rooms', function(room ){
		socket.emit();
	});


	})
	io.on('disConnect', function(){

	});
}

function assignGuestName(socket, guestNumber, nickNames, namesUsed){
	var name = "Guest" + guestNumber;
	namesUsed.push(name);
	nickNames[socket.id] = name;
	socket.emit('nameResult',{
		success:true,
		name:name
	});
	guestNumber += 1;
	return guestNumber;
}
function joinRoom(socket, room) {
	socket.join(room);
	currentRooms[socket.id] = room;

	socket.emit('joinResult',{room:room});
	socket.broadcast.to(room).emit('message', {
		text:nickNames[socket.id] 'has joined' + room +":"
	});
	var usersInRoom = io.sockets.clients(room);
	if(usersInRoom.length>1){
		var usersInRoomSummary = "Users currently in " + room + ":";
		for(var i in usersInRoom){
			var userSocketId = usersInRoom[i].id;
			if(userSocketId != socket.id ){
				if(i>0){
					usersInRoomSummary += ",";
				}
				usersInRoomSummary += nickNames[userSocketId];
			}
		}
		usersInRoomSummary += ".";
		socket.emit('message', {
			text:usersInRoomSummary
		});
	}
}

function handleMessageBroadcasting (socket, room, message) {
	socket.broadcast.to(room).emit('message', {
		text:message
	});

}
