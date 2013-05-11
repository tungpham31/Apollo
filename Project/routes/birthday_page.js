//### Define the libraries
var user_sessions = require('./user_sessions');
var userlib = require('../lib/user');

//###Display say-happy-birthday page after checking user's auth status
//Requires a request and a responce object as parameters
exports.displayPage = function(req,res){
	// check if user is logged in already
	var user  = req.session.user;
	if (user === undefined || !user_sessions.isUserOnline(user.username)){
		req.flash('auth', 'Not logged in!');
		res.redirect('/login');
		return; 
	}

	/* If user is logged in, we render a say-happy-birthday view 
	with initial hashtage about birthday and the birthday user*/
	// get the username pass from request
	var tmpUsername = req.params.username;	
	// find the user with that particular username
	var tmpUser = userlib.findUserWithUsername(tmpUsername);
	// render a birthday page for that user
	res.render('birthday_page', { title: 'Birthday Page',
								  username : tmpUsername,
								  birthdayUser : tmpUser});
};

//###Record the twitt user compose from birthday page
exports.composeTwitt = function(req, res){
	//Checks if the user is logged in already (doesn't return if the user is not logged in)
	if(sessCheck(req, res)){
		var user = req.session.user;
		var twitt = req.body.twitt;
		userlib.makeTwitt(user.username, twitt);

    	res.render('birthday_page', {title: "Your Twitt Is Composed Successfully!",
    								 username : undefined,
    								 birthdayUser : undefined});
	}
};