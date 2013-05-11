// # User Library
// ### A lot of logic handled here
//This handles the bulk of the responsibility before calling methods from the database. Also a library to get lists of users.
var testdate = ("10/03/2013, 20:13:14");
var db = require('./mockdb');
var userlib = require('./user')
var online = {}; //used to redirect to homepage if session still active. Not implemented yet.
var userdb = db.userdb; //for easy access to mock database of users.
var twittlib = require('./twitt');

//###Converts a username into an index
function indexOfUser(username){
	var userdex = -1;
	for(var i = 0; i < userdb.length; i++){
		if(userdb[i].username === username){
			userdex = i;
		}
	}
	return userdex;
}

//###Creates a user and updates the database
//No checking is done here. Check duplication before using this. Can be extended to do checks here.
exports.createUser = function(username, password, fullname, job, dob, country){
	db.createUser(username, password, fullname, job, dob, country); //Passes responsibility to database to update.
}

//###The bulk of logic is handled here. Database is updated here on all fronts.
exports.makeTwitt = function(username, content){//Given username and content, creates a twitt and updates database.
	var usernum = indexOfUser(username); //Converts username to user index
	if(usernum != -1){
		var topics = generateTopics(content); //topics, in words
		var timenow = new Date(); //The date and time of right now
		db.addTwitt(usernum, topics, content, timenow); //Passes data for database to update
	}
}

//###Lists all topics a user is interested in
//Given username, returns all topics associated with user
//Note that this lists *topics*, not just *topic names*
exports.listTopics = function(username){
	var retval = [];
	var usernum = indexOfUser(username);
	var usr = userdb[usernum];
	if(usernum != -1){
		for(var i = 0; i < usr.topics.length; i++){
			retval.push(db.topicdb[usr.topics[i]]);
		}
	}
	return retval;
}

//###Simply returns how many people are following this user
exports.numUsersFollowing = function(username){
	var usernum = indexOfUser(username);
	var user = db.userdb[usernum];
	if(usernum != -1){
		return user.numusersfollowing;
	}
	return;
}

//###Lists all usernumbers of users that user is following
//Given username, returns user NUMBERS the user follows
exports.listUsersFollowed = function(username){
	var retval = [];
	var usernum = indexOfUser(username);
	var usr = db.userdb[usernum];
	if(usernum != -1){ //We find the user
		retval = usr.usersfollowed;
	}
	return retval;
}

//###Lists all twitts a user has posted
//This lists all *twitts*, not just *content*
exports.listTwitts = function(username){
	var retval = [];
	var usernum = indexOfUser(username);
	var usr = db.userdb[usernum];
	if(usernum != -1){
		for(var i = usr.twitts.length - 1; i >= 0; i--){
			retval.push(db.twittdb[usr.twitts[i]]);
		}
	}
	return retval; //Given username, returns all twitts made by user
}

//###Lists all twitts a user has posted
//This lists only *content* of the twitt
exports.listTwittContents = function(username){
	var twitts = exports.listTwitts(username);
	var retval = [];
	for (var i in twitts)
		retval.push(twittlib.twittToString(twitts[i]));

	return retval;
}

//###Lists the LATEST TWITT of a user
//Given a username, returns a twitt object for last twitt
exports.latestTwitt = function (username){
	var usernum = indexOfUser(username);
	var usr = userdb[usernum];
	if(usernum != -1){
		return db.twittdb[usr.twitts[usr.twitts.length-1]];
	}
}

//###LatestTwitt method, except given a user INDEX instead of a NAME
//There really is probably a much easier way to code both methods in one method
function latestTwitt2(userdex){
	var usr = userdb[userdex];
	if(userdex >= 0 && userdex < userdb.length){
		return db.twittdb[usr.twitts[usr.twitts.length-1]];
	}
	return; //Return nothing if user has no twitts
}
		
//###Lists all the latest twitts of users someone is following
//An amalgation of above methods which aren't necessary any more (but were coded)
exports.listLatestTwitts = function(username){
	var retval = [];
	var usernum = indexOfUser(username);
	var usr = db.userdb[usernum];
	if(usernum != -1){
		for(var i = 0; i < usr.usersfollowed.length; i++){
			var followeduser = usr.usersfollowed[i];
			var latesttwitt = latestTwitt2(followeduser);
			if(latesttwitt != undefined)
			{
				retval.push(latesttwitt);
			}
		}
	}
	return retval; //Given username, returns latest twitt of users followed
}

		
//###Generates topics it belongs to on the fly. Right now, all words following # are topics.
//Given a string, returns a list of words which were marked by # (topics)
function generateTopics(content){
	generatedTopics = [];
	var splitstring = content.toLowerCase().split(" "); //Splits on spaces. *Lowercases everything.*
	for(var i = 0; i < splitstring.length; i++){
		if(splitstring[i].indexOf("#") === 0){ 			//*Any word starting with #* is a topic
			generatedTopics.push(splitstring[i].slice(1, splitstring[i].length));
		}
	}
	return generatedTopics;
}	

//###Binds a user to a topic
//Given a username and a topicname, adds that topic to the user's list of topics
exports.bindTopic = function(username, topicname){
	var usernum = indexOfUser(username); //user number
	if(usernum != -1){
		if(exports.likesTopic(username, topicname) === false){ //Check that user doesn't like topic
			db.bindTopic(usernum, topicname); //Passes responsibility to the database to update
		}
	}
}

//###Binds a user to follow another user
//Given two usernames, makes first user follow second user
exports.bindUser = function(follower, followed){
	var followernum = indexOfUser(follower);
	var followednum = indexOfUser(followed);
	if(followernum != -1 && followednum != -1){ //Make sure both users exist
		if(exports.followsUser(followernum, followednum) === false){ //Check that not already following user
			db.bindUser(followernum, followednum);
		}
	}
}

//###Makes a user STOP FOLLOWING another user
//Given two usernames, makes first STOP FOLLOWING second user
exports.unBindUser = function(follower, followed){
	var followernum = indexOfUser(follower);
	var followednum = indexOfUser(followed);
	if(followernum != -1 && followednum != -1){ //Make sure both users exist
		if(exports.followsUser(followernum, followednum) === true){ //Check that we are following user
			db.unBindUser(followernum, followednum);
		}
	}
}

//###Unbinds a user from a topic
//Given a username and a topicname, removes topic from user
exports.unbindTopic = function(username, topicname){
	var usernum = indexOfUser(username); //user number
	if(usernum != -1){
		if(exports.likesTopic(username, topicname) === true){ //Check that user likes topic
			db.unbindTopic(usernum, topicname); //Passes responsibility to the database to update
		}
	} 
}

//###Finds out if a user likes a topic
//Given a username and a topicname, returns true if user likes that topic
exports.likesTopic = function(username, topicname){
	var usernum = indexOfUser(username); //user number
	if(usernum != -1){
		var user = userdb[usernum];
		for(var i = 0; i < user.topics.length; i++){
			if(db.topicdb[user.topics[i]].name === topicname){
				return true;
			}
		}
	} 
	return false
}

//###Finds out if a user follows another user
//Given given two user NUMBERS, returns true if param(1) is following param(2)
exports.followsUser = function(followernum, followednum){
	if(db.userdb[followernum].usersfollowed.indexOf(followednum) != -1){
		return true;
	}
	return false
}

//###Same function, as previous, but takes in username
//Given two user NAMES, returns true if 1st follows second
exports.followsUsername = function(followername, followedname){
	var num1 = indexOfUser(followername);
	var num2 = indexOfUser(followedname);
	if(num1 != -1 && num2 != -1)
	{
		return exports.followsUser(num1, num2);
	}
	return false;
}

//### lookup function
// locates a user by `name` if it exists. Invokes callback `cb` with the
// signature cb(error, userobj).
exports.lookup = function(username, password, cb) {
  var len = userdb.length;
  for (var i = 0; i < len; i++) {
    var u = userdb[i];
    if (u.username === username) {
      if (u.password === password) {
        cb(undefined, u);
      }
      else {
        cb('password is not correct');
      }
      return;
    }
  }
  cb('user not found');
};

//###Returns a string of all usernames, seperated by spaces.
function get_users(){
  var result = "";
  for(var i = 0; i < userdb.length; i++){
    result = result + userdb[i].username + " ";
  }
  return result;
}
//###Checks to see if the user is contained in the database.
function has_user(username){
	if(indexOfUser(username) != -1){
		return true;
	}
	return false;
}

exports.has_user = has_user;

//###Test function for get_users().
exports.list = function(req, res){
  res.send("" + get_users())
};

//###Returns the Userdata objects of all users whose profile information matches the query string.
exports.searchUsersWithKeyword = function(keyword){
  var result = [];
  for(var i = 0; i < userdb.length; i++){
    var u = userdb[i]; 
    if (u.username.indexOf(keyword) > -1 
      || u.name.indexOf(keyword) >-1 
      || u.job.indexOf(keyword) > -1){
      result.push(u);
    }
  }

  if (result === "") result = "No user found";
  return result;
};

//###Returns the username of all users whose profile information matches the query string.
//Usernames are returned with symbol '@' in front
exports.searchUsernamesWithKeyword = function(keyword){
	var users = exports.searchUsersWithKeyword(keyword);
	var usernames = [];
	for (var userId in users)
		usernames[userId] = '@' + users[userId].username;
	return usernames;
};

//### 
exports.numberOfUsers = function(){
  return userdb.length;
};

//###Given an integer representing a userdb index, returns the associated Userdata object.
exports.findUserWithNumber = function(number){
	if(number < userdb.length && number > -1){ //Safeguards against going out of array bounds.
		return userdb[number];
	}
	return undefined;
};

exports.findUserWithUsername = function(username){
  for (var i = 0; i < userdb.length; i++)
    if (userdb[i].username === username){
      return userdb[i];
    }
  return undefined;
};

// find an user with a specific id
exports.findUserWithID = function(id){
	if (id < userdb.length)
		return userdb[id];
	return undefined;
}

//### determine whether today is this user's birthday
exports.isBirthdayToday = function(user){
	var today = new Date();
	user = userlib.findUserWithUsername(user.username);
	var birthday = user.birthday;
	if (today.getDate() === birthday.getDate() && today.getMonth() === birthday.getMonth())
		return true;
	return false;
}

//### given an username, find all his followers, return user object
exports.findFollowersWithUsername = function(username){
	// get the id of the user with this username
	var userid;
	for (var i in userdb)
		if (userdb[i].username === username)
			userid = i;

	// get his followers
	var followers = [];
	for (var i in userdb[userid].usersfollowing){
		var followerid = userdb[userid].usersfollowing[i];
		followers.push(userdb[followerid]);
	}

	return followers;
}