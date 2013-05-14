
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/channel.html', function(req, res) {
	res.sendfile('./public/channel.html');
});

//###The correct way to host an HTTP server using an Express instance
var httpServer = http.createServer(app);
console.log("Express server hosting on port " + app.get("port") + ".");
httpServer.listen(app.get("port"));

// Setup WebSocket.
var io = require('socket.io').listen(httpServer);

//###Register 'connection' event - which is when a client becomes connected to the server.
//		This is used for all of our websocket stuff.
io.sockets.on('connection', function(socket){
	
	//register room join event; called by client after connection initiated.
	socket.on('join', function(dataForRoom){ 
		var theRoom = dataForRoom.room;
		socket.join(theRoom); //just takes a string for which room to join
	});

	//Used when a new user registers.
	socket.on('addUser', function(data){
		var theUser = data.userName; //pull the username from the JSON object
		io.sockets.in('login').emit('newUser', {"userName" : theUser});
	});

	//Used when chat messages are sent (in the Chat page)
	socket.on('addChatMessage', function(messageObject){
		var theMessage = messageObject.message;
		var theUserName = messageObject.username;
		var broadcasterName = theUserName;
		io.sockets.in(broadcasterName).emit('newHangoutMessage', {"message" : theMessage, "username" : theUserName })
	});

	//Used when chat messages are sent in the hangout page
	socket.on('addHangoutMessage', function(messageObject){
		var theMessage = messageObject.message;
		var theUserName = messageObject.username;
		var broadcasterName = messageObject.broadcasterName;
		io.sockets.in(broadcasterName).emit('newHangoutMessage', {"message" : theMessage, "username" : theUserName})	
	});

	//Used when video state messages are sent in the hangout page
	socket.on('youtube_player_state_change', function(messageObject){
		var theMessage = messageObject.message;
		var broadcasterName = messageObject.username;
		io.sockets.in(broadcasterName).emit('youtube_player_state_change', {"message" : theMessage, "username" : broadcasterName})	
	});

	//Used when a new video is added in the chat page
	socket.on('add_new_video_to_youtube_player', function(messageObject){
		var url = messageObject.url;
		var broadcasterName = messageObject.username;
		io.sockets.in(broadcasterName).emit('add_new_video_to_youtube_player', {"url" : url, "username" : broadcasterName})	
	});

	//Used when receiving an update from broadcaster's youtube player
	socket.on('update_youtube_player_state', function(messageObject){
		var videoId = messageObject.videoId;
		var currentTime = messageObject.current_time;
		var playerState = messageObject.player_state;
		var broadcasterName = messageObject.username;
		console.log("app receive: " + videoId + " " + currentTime + " " + playerState + " " + broadcasterName);
		io.sockets.in(broadcasterName).emit('update_youtube_player_state', {"videoId" : videoId, "currentTime" : currentTime, "playerState" : playerState});	
	});
});
