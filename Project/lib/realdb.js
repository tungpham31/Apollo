//#Real Database! 
//###ORIGINAL IMPLEMENTATION. COMPLETELY SCRAPPED. Left here for... pity effort points

var sqlite3 = globSqlite3;
var db = globDb;

//#Data retrieval
//##Deals with getting data about twitts, topics, and users
//##GETTING USER DATA
//###Gets all users, all data
exports.getUsers = function() {
	var retval = [];
	db.each('SELECT * FROM users AS u', function(err, row) {
		retval.push(row)
	})
	return retval;
};

//###Getting all usernames
exports.getUserNames = function() {
	retval = [];
	db.each('SELECT u.username FROM users AS u', function(err, row) {
		retval.push(row);
	})
	return retval;
};

//###Get all topics a user is following
exports.getUserTopics = function(username) {
	retval = [];
	db.each('SELECT DISTINCT t.topicname FROM users AS u JOIN topics AS t WHERE u.username = t.username AND u.username = ?', [username], function(err, row){
		retval.push(row);
	})
	return retval;
};

//###Get all users a user is following
exports.getUserUsers = function(username) {
	retval = [];
	db.each('SELECT u.followedname FROM userfollow AS u WHERE u.followername = ?', [username], function(err, row){
		retval.push(row);
	})
	return retval;
};

//##TWITT DATA RETRIEVAL
//###Get all Twitts of a user
exports.getUserTwitts = function(username) {
	retval = [];
	db.each('SELECT * FROM twitts AS t JOIN users AS u WHERE t.username = ? AND u.username = ?', [username, username], function(err, row){
		retval.push(row);
	})
	//TO DO: Prune the same content
	return retval;
};

//###Gets twitts, content-distinct, not a good reflection of topic
exports.getUserTwittsDistinct = function(username) {
	retval = [];
	db.each('SELECT DISTINCT tw.username, tw.fullname, tw.content, tw.twittdate FROM twitts AS tw JOIN users AS u WHERE tw.username = ? AND u.username = ? GROUP BY twittdate', [username, username], function(err, row){
		retval.push(row);
	})
	return retval;
};

//###Get all twitts by user for a topic
exports.getUserTwittsTopic = function(username, topicname) {
	retval = [];
	db.each('SELECT DISTINCT * FROM topics AS t JOIN users AS u JOIN twitts AS tw WHERE t.username = ? AND t.topicname = ? AND t.username = u.username AND u.username = tw.username AND t.topicname = tw.topicname', [username, topicname], function(err, row){
		retval.push(row);
	})
	return retval;
};

//###Get all twitts ever
exports.getTwitts = function() {
	retval = [];
	db.each('SELECT * FROM twitts', function(err, row){
		retval.push(row);
	})
	return retval;
};

//##TOPIC DATA RETRIEVAL
//###Gets all topic names
exports.getTopics = function() {
	retval = [];
	db.each('SELECT DISTINCT t.topicname FROM topics AS t', function(err, row) {
		retval.push(row);
	})
	return retval;
};

//#Creation
//##Deals with creating things (twitts/topics/stuff)
//###Creates a new user. No checking.
exports.createUser = function(username, password, fullname, job, dob, country){
	db.run('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)', [username, password, fullname, date, job, country]);
}

//###Creates a new, BLANK topic
//BLANK. MUST MAKE SURE TOPIC IS UNIQUE BEFORE CALLING THIS
exports.createTopic = function(topicname){
	db.run('INSERT INTO topics VALUES (?, "")', [topicname]);
}

//###Important function. Adds a Twitt. Updates all relevant databases.
exports.addTwitt = function(username, topics, content, date){
//Given a username, a list of topic names, Twitt content, and a date object
	var fullname = username;
	db.get('SELECT u.fullname FROM users AS u WHERE u.username = ?', [username], function(err, row){
		fullname = row.fullname;
	})
	
	for(var i in topics){
		db.run('INSERT INTO twitts VALUES (?, ?, ?, ?, ?)', [date, content, username, fullname, topics[i]]);
	}
}

//#Bindings
//##Deals with binding stuff to other stuff. Sometimes involves adding things.
//###Binds a topic to a user. Makes user follow topic.
//Given a username and a topicname, adds that topic to the user's list of topics
exports.bindTopic = function(username, topicname){
	if(usertopic(username, topicname) === false){ //Only do if the user doesn't have topic binded
		db.run('INSERT INTO topics VALUES (?, ?)', [topicname, username]);
	}
}

//###Unbinds a user from a topic
//Given a username and a topicname, removes topic from user
exports.unbindTopic = function(username, topicname){
	if(usertopic(username, topicname) === true){ //Only do if the user has topic binded
		db.run('DELETE FROM topics WHERE t.topicname = ? AND t.username = ?', [topicname, username]);
	} 
}


//#Utility.
//##Utility functions.
//###A function that takes a birthday, and returns current age
//Takes in date, returns age
function calcAge(bday) {
  return Math.floor((Date.now() - bday) / (31557600000));
}

//###A function that takes in a username and a topicname
//Returns stuff depending on whether stuff exists.
exports.usertopic = function(username, topicname){
	var selections = [];
	db.each('SELECT * FROM topics WHERE topicname = ? AND username = ?', [topicname, username], function(err, row){
		selections.push(row);
	});
	return selections;
}

usertopic = exports.usertopic;