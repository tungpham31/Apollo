var userlib = require('../lib/user');
var user_sessions = require('./user_sessions');
var topiclib = require('../lib/topic');
var twittlib = require('../lib/twitt')

exports.displayPage = function(req,res){
	//Check if user is logged in already
	if(sessCheck(req, res) === true){
		/* If user is logged in, we render a chat page view 
		*  with topics and twitts related to this user
		*/
		var theUser = req.session.user;
		res.render('chat_page', { title: 'Twittim Hangout Page',
			userName : theUser.username
		});
	}
	else{
		req.flash('auth', 'Please log in. ');
		res.redirect('/login');
	}
};

