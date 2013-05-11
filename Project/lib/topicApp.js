var x = require('y'); //get user name

//Handles realtime updating of the list of topics a user is following.

exports.init = function(socket) {
	socket.on("connect", function(data) {
		console.log('received connection: ' + JSON.stringify(data));
		socket.broadcast.emit('post', data);
	});
};

exports.joinRoom = function(socket){
	;
}

