//###Responsible for user session management, user authentication, and logging users in/out

var userlib = require('../lib');

//###Fake database for storing the users
var online = {};

//###Login - one of the few places sessCheck cannot be placed due to an infinite loop.
//Requires a request and a responce object as parameters
exports.displayPage = function(req, res){
  var authmessage = req.flash('auth') || '';

  var user  = req.session.user;
  if (user !== undefined && online[user.username] !== undefined) {
    res.redirect('/homepage'); //user already logged in, redirect to homepage
  }
  else {
    res.render('login_page', {title : 'TWITTIM LOGIN',
                              message : authmessage,
						  	  resources: '../bin'});
  }
};

// ###Performs user authentication.
//Redirects the user if already logged in.
//Requires a request and a response object as parameters
exports.auth = function(req, res) {
	var user = req.session.user;
	if (sessCheck(req,res)) { //if user already logged in, redirect to homepage
		res.redirect('/homepage');
	}
	else{
		var username = req.body.loginUsername;
		var password = req.body.loginPass;
		userlib.lookup(username, password, function(error, user) {
			if (error) {
				req.flash('auth', error);
				res.redirect('/login');
				}
			else {
				req.session.user = user;
				online[user.username] = user;
				res.redirect('/homepage'); //successful login
			}
		});
	}
};

//###Logout
//Deletes the user session, removes them from "online" "database"
//Requires a request and a response object as parameters
exports.logout = function(req, res) {
	var user = req.session.user;
	if(sessCheck(req,res)){
		if (online[user.username] !== undefined) {
			delete online[user.username];
		}
		delete req.session.user;
	}
	res.redirect('/login');
};

//###Check if a user with a particular userID is online
//Takes a username string and returns a boolean
exports.isUserOnline = function(username){
	if(username === undefined){
		return false;
	}
  if(online[username] !== undefined){
	  return true;
  }
};
