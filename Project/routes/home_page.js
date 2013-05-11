var userlib = require('../lib/user');
var user_sessions = require('./user_sessions');
var topiclib = require('../lib/topic');
var twittlib = require('../lib/twitt')

//###Display home page after checking user's auth status
//Requires a request and a response object as parameters
exports.displayPage = function(req,res){	
	//Check if user is logged in already
	if(sessCheck(req, res) === true){
		/* If user is logged in, we render a homepage view 
		*  with topics and twitts related to this user
		*/
		var theUser = req.session.user;
		var topiclist = userlib.listTopics(theUser.username);
		var twittlist = [];
		for(var t in topiclist){
			twittlist.push(topiclib.listTwitts(topiclist[t].name));
		}

		res.render('home_page', { title: 'Twittim Homepage',
		twitts : userlib.listTwitts(theUser.username),
		topics : topiclist,
		topictwitts : twittlist,
		usersfollowed : userlib.listUsersFollowed(theUser.username),
		numusersfollowing : userlib.numUsersFollowing(theUser.username),
		usertwitts : userlib.listLatestTwitts(theUser.username),
		currentUser : theUser,
		isBirthdayToday : userlib.isBirthdayToday(theUser),
		birthdayNotifications : getBirthdayNotifications(theUser)});
	}
	else{
		req.flash('auth', 'Please log in. ');
		res.redirect('/login');
	}
};

//###Gets people's birthday and generates the appropriate notification
//###Takes the user who will get the notifications as input
//###Returns a list of notification strings
getBirthdayNotifications = function(user){
	var notifications = [];
	// get the id of people who the current user follow
	var idOfUsersFollowed = userlib.listUsersFollowed(user.username);
	// if this user does not follow anyone, we just return an empty array
	// indicating that there is no notification
	if (idOfUsersFollowed.length === 0) return [];

	//Gets a list of all users who this user follows and will have birthday in 7 days
	for (var i = 0; i <= idOfUsersFollowed.length - 1; i++){
		// get one persone this user follow
		var userFollowed = userlib.findUserWithID(idOfUsersFollowed[i]);
		var birthday = userFollowed.birthday;
		// change the year of his birthday to current year so that we can easily compare it
		// to the current date
		var originalYear = birthday.getFullYear();
		birthday.setYear((new Date()).getFullYear());
		// milisecond is first the milisecond from this current time back to Jan, 1, 1970
		numberOfMilliseconds = Date.parse((new Date()).toDateString());
		// now milisecond will be the difference between userFollowed's birthday and this current time
		numberOfMilliseconds = Date.parse(birthday.toDateString()) - numberOfMilliseconds;
		// set year of birthday back to original
		birthday.setYear(originalYear);
		// calculate the days difference between userFollowed's birthday and current day
		var numberOfDays = numberOfMilliseconds / 1000 / 60 / 60 / 24;

		//Creates notification about this userFollowed
		notif = new Object();
		notif.username = userFollowed.username;
		notif.numberOfDays = numberOfDays;
		// we only consider birthday within 7 days from the current day
		if (0 <= numberOfDays && numberOfDays <= 7){
			// if today is his birthday, we create a happy birthday message
			if (numberOfDays === 0)
				notif.message = 'Today is ' + userFollowed.name + "'s birthday.";
			// otherwise, we tell this user to go prepare gift for him
			else notif.message = userFollowed.name + "'s birthday is in " + numberOfDays + ' day(s). Go buy something!!!';

			// add notif to notifcations
		 	notifications.push(notif);
		}
	}

	//Sorts the notification in chronilogical order
	notifications.sort(function(notif1, notif2){
		// if notif1 represents a birthday today, return -1 because it has highest priority
		if (notif1.message.search("Today") != -1) return -1;
		// if notif2 represents a birthday today, return 1 because it has highest priority
		if (notif2.message.search("Today") != -1) return 1;
		// if both notif1 and notif2 do not represent a birthday today, simply compare the number of days their birthday are coming
		if (notif1.numberOfDays < notif2.numberOfDays) return -1;
		return 1;
	});

	return notifications;
}

//###Support for creating new twits
//Requires a request and a response object as parameters
exports.composeTwitt = function(req,res){
	//Checks if the user is logged in already (doesn't return if the user is not logged in)
	if(sessCheck(req, res)){
		var user = req.session.user;
		var twittObj = req.body;
		var twitt = twittObj.newTwitt;
		userlib.makeTwitt(user.username, twitt);

		var edittedTwittObj = {edittedTwitt : twittlib.twittToString(userlib.latestTwitt(user.username))};

		// Set content type to be json:
   		res.contentType('application/json');
    	res.send(edittedTwittObj);
	}
};

//###Redirects to the user's profile page (your own or others')
exports.profile = function(req,res){
	res.redirect("/profilepage");
};