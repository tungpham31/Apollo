//### import libraries
var userlib = require('../lib/user');
var user_sessions = require('./user_sessions');

//###Logic for handling display of user profile pages
// handles 3 cases:
//	1.) user requesting own profile page
//	2.) user requesting a profile page of another
//  3.) user requesting a profile page that DNE
//Requires a request and a responce object as parameters
exports.displayPage = function(req,res){
	if (sessCheck(req, res)){ //Checks if the user is logged in already
		var user  = req.session.user;
		//Gets the username from the request
		var username = req.params.username;
		var u;
		if (username !== undefined) {
			//Removes the ':' in the username
			username = username.replace(':', '');
			//u is set to the user with the username
			u = userlib.findUserWithUsername(username);
		}

		//If u is still undefined, that means that we should direct to the user's own profile page
		//Gets the user of this current session
		if (u === undefined) u = req.session.user;

		//If the username of u is not similar to the username of this session, we will be viewing someone else's profile
		if (u.username !== req.session.user.username)
		res.render('profile_page', { title: username + "'s Profile Page", 
		user: u,
		following: userlib.followsUsername(user.username, username),
		twitts: userlib.listTwitts(username),
		ownProfile: false   });
		//Otherwise, view your own profile
		else res.render('profile_page', {title: "Your Profile Page",
		user : u,
		twitts: userlib.listTwitts(u.username),
		ownProfile: true });
	}
	else{
		res.redirect('/login');
	}
};

//###Unfollow someone you're already following
//Requires a request and a responce object as parameters
exports.unfollow = function(req,res){
	//Checks if the user is logged in already
	var user  = req.session.user;
	if (user === undefined || !user_sessions.isUserOnline(user.username)){
		req.flash('auth', 'Not logged in!');
		res.redirect('/login');
		return;
	}
	//If the user is logged in, get the username and send this information to userlib
	var userviewed = req.params.userviewed;
	userlib.unBindUser(user.username, userviewed);
	res.redirect('/userview/'+userviewed); //This is a REDIRECT instead of a display, to use the route logic
}

//###Follow someone you aren't following
//Requires a request and a responce object as parameters
exports.follow = function(req,res){
//Checks if the user is logged in already
	var user  = req.session.user;
	if (user === undefined || !user_sessions.isUserOnline(user.username)){
		req.flash('auth', 'Not logged in!');
		res.redirect('/login');
		return;
	}
	var userviewed = req.params.userviewed;
	userlib.bindUser(user.username, userviewed);
	res.redirect('/userview/'+userviewed); //This is a REDIRECT instead of a display, to use the route logic
}