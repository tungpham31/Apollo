//###Module Dependencies
var express = require('express')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash');

var app = express(); 
var users = require('./lib');
var myroutes = require('./myRoutes.js'); //centralizes routes
var user_sessions = require('./routes/user_sessions');

//###Middleware for authorizing user route requests.
//Returns true if they are currently logged in.
//Checks that a session exists for this user to do this.
//Requires a request and a response object as parameters
function sessionCheck(req, res){
	//if there is anything at all wrong with the user session, then redirect them to the login page.
	if(req === undefined || res === undefined){ //check for undefined request/response objects, abort if so!
		return false;
	}
	if(req.session !== undefined && req.session.user !== undefined && user_sessions.isUserOnline(req.session.user.username) === true){ 
		return true;
	}
	else{ //user not authenticated with valid session
	    return false;
	}
}

//###declare global variable' sessCheck' to be used by route functions to check user sessions.
sessCheck = sessionCheck;

//###Initializes Express
app.configure(function(){
	app.use(express.bodyParser());  	//use this AFTER middleware is set up!
	app.use(express.methodOverride());
	app.use(express.logger('dev'));
	app.use(express.cookieParser('cookies monster')); 
	app.use(express.session()); 		//session and flash support
	app.use(flash());
	app.use(app.router); 				//this should the the very last app.use()
  	app.set('view engine', 'ejs');		
	app.set('views', __dirname + '/views');
  	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//###routes used when user sends some GET request
app.get('/', myroutes.home.home);
//Viewing the login page 
app.get('/login', myroutes.login.displayPage);
//Viewing the user's homepage
app.get('/homepage', myroutes.homepage.displayPage);
//Viewing a user page
app.get('/userview/:username', myroutes.profilepage.displayPage); 
//Viewing a topics page. Note that it's tweet#topicname.
app.get('/topicview/:topicname', myroutes.topicpage.displayPage);
//Viewing a user's profile page. If users A,B both look at user A's profile page, they see the same thing.
app.get('/profilepage', myroutes.profilepage.displayPage);
//Viewing a say-happy-birthday page
app.get('/birthdaypage/:username', myroutes.birthdaypage.displayPage);
//View the chat page (join the chat room)
app.post('/chatpage', myroutes.chatpage.displayPage);
//Get followers database from server
app.post('/getFollowers', myroutes.discoverpage.getFollowers);
//Viewing a discover page
app.post('/discoverpage', myroutes.discoverpage.displayPage);
//###Routes used when there are some POST request
app.post('/search'  , myroutes.searchPage.displayPage);
//display profile page
app.post('/profilepage', myroutes.profilepage.displayPage);
//display home page
app.post('/homepage', myroutes.homepage.displayPage);
//user logins
app.post('/user/auth'  , myroutes.sessions.auth); 				
//user logouts		
app.post('/logout', myroutes.sessions.logout); 						
//user composes a twitt
app.post('/twitt' , myroutes.homepage.composeTwitt); 	
//user composes a birthday twitt
app.post('/birthday/twitt', myroutes.birthdaypage.composeTwitt)				
//user dislikes a topic
app.post('/unliketopic/:topicname', myroutes.topicpage.unlikeTopic);
//user likes a topic	
app.post('/liketopic/:topicname', myroutes.topicpage.likeTopic); 		
//user unfollows a user
app.post('/unfollowuser/:userviewed', myroutes.profilepage.unfollow);
//user follows a user
app.post('/followuser/:userviewed', myroutes.profilepage.follow);
//register a new user
app.post('/user/register', myroutes.registrypage.displayPage);
//COMPLETE registration
app.post('/user/complete_registry', myroutes.registrypage.completeRegistration);
//View hangout page
app.post('/hangoutpage', myroutes.hangoutpage.displayPage);

//###The correct way to host an HTTP server using an Express instance
var port = 3000;
var httpServer = http.createServer(app);
console.log("Express server hosting on port " + port + ".");
httpServer.listen(port);

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