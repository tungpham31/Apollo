//##Topic Page
//### Import libraries
//Library to return topics
var topiclib = require('../lib/topic'); 
//User session details
var user_sessions = require('./user_sessions'); 
//Library to return users
var userlib = require('../lib/user'); 

//###Display the page
//Requires a request and a responce object as parameters
exports.displayPage = function(req,res){
	//Checks if the user is logged in already
	var user  = req.session.user;
	if (user === undefined || user_sessions.isUserOnline(user.uid)){
		req.flash('auth', 'Not logged in!');
		res.redirect('/login');
		return;
	}

	//Passes the twittlist and the topicname to be rendered
	var topicname = req.params.topicname;
	
	//Now we have to see if this topic has been created yet.
	var topicExists = topiclib.isTopicInDatabase(topicname);
	//If it doesn't exist, we make it!
	if(!topicExists){
		topiclib.createTopic(topicname);
	}
	
	var twittlist = topiclib.listTwitts(topicname);
	var likestopic = userlib.likesTopic(user.username, topicname); //Also whether the user likes the topic
	res.render('topic_page', {title: topicname,
									 twitts: twittlist,
									 likes: likestopic,
									 currentUser: user});
};

//###Dislike a topic that you like. Stops subscription.
//Requires a request and a responce object as parameters
exports.unlikeTopic = function(req,res){
	//Checks if the user is logged in already
	var user  = req.session.user;
	if (user === undefined || user_sessions.isUserOnline(user.uid)){
		req.flash('auth', 'Not logged in!');
		res.redirect('/login');
		return;
	}

	// if user is logged in, get the topic name 
	// and send this information to userlib
	var topicname = req.params.topicname;
	userlib.unbindTopic(user.username, topicname);
	exports.displayPage(req,res);
}

//###Like a topic, subscribe to it.
//Requires a request and a responce object as parameters
exports.likeTopic = function(req,res){
//Checks if the user is logged in already
	var user  = req.session.user;
	if (user === undefined || user_sessions.isUserOnline(user.uid)){
		req.flash('auth', 'Not logged in!');
		res.redirect('/login');
		return;
	}
	var topicname = req.params.topicname;
	userlib.bindTopic(user.username, topicname);
	exports.displayPage(req,res);
}