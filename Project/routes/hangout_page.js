var userlib = require('../lib/user');
var user_sessions = require('./user_sessions');
var topiclib = require('../lib/topic');
var twittlib = require('../lib/twitt');
var database = require('../lib/mockdb');

//###Display discover page after checking user's auth status
//Requires a request and a response object as parameters
exports.displayPage = function(req,res){
	//Check if user is logged in already
	if(sessCheck(req, res) === true){
		var broadcaster = req.body.broadcasterUsername;
		var theUser = req.session.user;
		res.render('hangout_page', { title: 'Twittim Hangout Page', 
			userName : theUser.username,
			broadcasterName : broadcaster 
		});
	}
	else{
		req.flash('auth', 'Please log in. ');
		res.redirect('/login');
	}
};