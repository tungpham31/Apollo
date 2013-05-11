//#Real Database! 
//###This is an extension of the mock database, to incorporate a real database

//Massive hackery abounds. The fake data layer literally reflects changes in the database.  It holds ALL THE DATA.
var sqlite3 = globSqlite3;
var db = globDb;

//###This function gets a name, and returns the index of the topic
function indexOfTopic(name){
	var topicdex = -1;
	for(var i = 0; i < topicdb.length; i++)
	{
		if(topicdb[i].name === name){
			topicdex = i;
		}
	}
	return topicdex; //Given a topic's name, returns the index of the topic in the database
}

//###This function gets a name, returns the index of a user
function indexOfUser(name){
	var userdex = -1;
	for(var i = 0; i < userdb.length; i++)
	{
		if(userdb[i].username === name){
			userdex = i;
		}
	}
	return userdex; //Given a user's username, returns the index of the user in the database
}

//###This function gets content and other twitt fields and returns the index of that twitt
function indexOfTwitt(content, username){
	var twittdex = -1;
	for(var i = 0; i < twittdb.length; i++)
	{
		if(twittdb[i].content === content && twittdb[i].poster === username){
			twittdex = i;
		}
	}
	return twittdex; //Given a twitt's content and other fields, returns the index of that twitt in mock database
} 

//###Create a new user
exports.createUser = function(username, password, fullname, job, dob, country){
	var newuser = new Userdata(username, password, fullname, dob, job, [], [], [], [], 0, country);
	exports.userdb.push(newuser);
	//Now for the database update
	db.run('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)', [username, password, fullname, dob, job, country]);
}

//###Database of user data. Original values scrapped.
exports.userdb = [];

//###A function that takes a birthday, and returns current age
//Takes in date, returns age
function calcAge(bday) {
  return Math.floor((Date.now() - bday) / (31557600000));
}


//###Representation of a user object in the database
function Userdata(username, password, name, birthday, job, twittlist, topiclist, usersfollowed, usersfollowing, numusersfollowing, country) {
	Username(username);			//adds username to index on creation of new Userdata object.
	this.username = username; 	//usernames are unique to each user
	this.password = password;
	this.name     = name;
	this.birthday = birthday;
	this.age      = calcAge(birthday);
	this.job      = job;
	this.twitts = twittlist; 	//List of twitts made by user, index numbers
	this.topics = topiclist; 	//List of topics user likes, index numbers
	this.usersfollowed = usersfollowed;		//List of users this guy follows
	this.usersfollowing = usersfollowing; // List of users folliwng this guys.
	this.numusersfollowing = numusersfollowing; 	//Number of users following
	this.country = country;
}

//Representation of a username. Is associated with a Userdata object, which represents a user object in the database.
function Username(username){
	this.username = username;
}

//###Twitt database. Original values cleared.
exports.twittdb = [];

//###Representation of Twitt object in database
function Twittdata(date, content, poster, topiclist, postername){
	this.date = date; //Date made, just a string, not a date object
	this.content = content; //Textual content
	this.poster = poster; //Username of posting user
	this.topics = topiclist; //List of topic numbers this belongs to, index numbers
	this.postername = postername; //FULL NAME of poster
};

//###List of topics in mock database. Original values cleared.
exports.topicdb = [];

//###Creates a new, BLANK topic
//BLANK. MUST MAKE SURE TOPIC IS UNIQUE BEFORE CALLING THIS
exports.createTopic = function(topicName){
	var newTopic = new Topicdata(topicName, [], []);
	exports.topicdb.push(newTopic);
	//Database update
	db.run('INSERT INTO topics VALUES (?, "")', [topicName]);
}

//###Representation of topic object in database
function Topicdata(name, twittlist, userlist){
	this.name = name; //Name of topic
	this.twitts = twittlist; //List of twitts in topic, index numbers
	this.users = userlist; //List of users liking topic, index numbers
}	

//For local usage of databases
var topicdb = exports.topicdb; //Make local variables out of the 3 databases
var userdb = exports.userdb;
var twittdb = exports.twittdb;

//###Important function. Adds a Twitt. Updates all relevant databases.
exports.addTwitt = function(usernum, topics, content, date){
//Given a user NUMBER, a list of topic names, Twitt content, and a date (now a date object)
	var topicnums = [];
	for(var i = 0; i < topics.length; i++){ //Run through every single topic
		var topicnum = indexOfTopic(topics[i]); 
		if(topicnum === -1){ //If topic isn't found, we create a new topic
			topicnums.push(topicdb.length);
			topicdb.push(new Topicdata(topics[i], [], []));
			//Update database
			db.run('INSERT INTO topics VALUES (?, "")', [topics[i]]); 
		}
		else{
			topicnums.push(topicnum); //If it's found, use the index of that topic
		}
	}
	var twittdex = twittdb.length; //Find the index of the newly added Twitt
	twittdb.push(new Twittdata(date, content, userdb[usernum].username, topicnums, userdb[usernum].name)); //Add data into Twitt database
	userdb[usernum].twitts.push(twittdex); //Add data into user's information
	
	for(var j = 0; j < topicnums.length; j++){
		topicdb[topicnums[j]].twitts.push(twittdex); //Add this Twitt to all topics it belongs to.
	}
	
	//Update database
	for(var i in topics){
		db.run('INSERT INTO twitts VALUES (?, ?, ?, ?, ?)', [date, content, userdb[usernum].username, userdb[usernum].name, topics[i]]);
	}
}

//###Bind a user number to a topic name. Changes relevant data fields.
exports.bindTopic = function(usernum, topicname){
	var topicnum = indexOfTopic(topicname);
	var usersOfTopic = topicdb[topicnum].users;
	var topicsOfUser = userdb[usernum].topics;
	if(topicnum != -1){ 				//If we find the topic
		usersOfTopic.push(usernum); 	//Add user to the topic
		topicsOfUser.push(topicnum); 	//Add topic to the user
		
		//Update database
		db.run('INSERT INTO topics VALUES (?, ?)', [topicname, userdb[usernum].username]);
	}
}

//###Unbinds a user number to a topic name. Changes relevant data fields.
exports.unbindTopic = function(usernum, topicname){
	var topicnum = indexOfTopic(topicname);
	var usersOfTopic = topicdb[topicnum].users;
	var topicsOfUser = userdb[usernum].topics;
	if(topicnum != -1){ //If we find the topic
		for(var t = 0; t < usersOfTopic.length; t++){
			if(usersOfTopic[t] === usernum){
				usersOfTopic.splice(t, 1); //Remove user from topic
			}
		}
		
		for(var t = 0; t < topicsOfUser.length; t++){
			if(topicsOfUser[t] === topicnum){
				topicsOfUser.splice(t, 1); //Remove topic from user
			}
		}
		
		//Update database
		db.run('DELETE FROM topics WHERE topicname = ? AND username = ?', [topicname, userdb[usernum].username]);
	}
}

//###Binds a user to follow another user. Changes relevant data fields. Both are NUMBERS.
exports.bindUser = function(following, followed){
	var isFollowed = userdb[following].usersfollowed.indexOf(followed);
	if(isFollowed === -1){ //If we aren't following the followed guy yet
		userdb[following].usersfollowed.push(followed);
		userdb[followed].usersfollowing.push(following);
		userdb[followed].numusersfollowing = userdb[followed].numusersfollowing + 1;
		
		//Database updating
		db.run('INSERT INTO userfollow VALUES (?, ?)', [userdb[following].username, userdb[followed].username]);
	}
	
	return isFollowed;
}

//###Unbinds user from following another user. Both are NUMBERS.
exports.unBindUser = function(following, unfollowed){
	var isFollowed = userdb[following].usersfollowed.indexOf(unfollowed);
	if(isFollowed != -1){ //This guy is following the other guy
		for(var t = 0; t < userdb[following].usersfollowed.length; t++){
			if(userdb[following].usersfollowed[t] === unfollowed){
				userdb[following].usersfollowed.splice(t, 1); //Remove user following from list
			}
		}

		var position = userdb[unfollowed].usersfollowing.indexOf(following);
		if (position != 1) 
			userdb[unfollowed].usersfollowing.splice(position, 1);
		userdb[unfollowed].numusersfollowing = userdb[unfollowed].numusersfollowing - 1; 
		
		//Update database
		db.run('DELETE FROM userfollow WHERE followername = ? AND followedname = ?', [userdb[following].username, userdb[unfollowed].username]);
	}
}

//###THE HACK. Populating the data layer with stuff from the database
//DO NOT CALL ANY MODIFIERS. DOING SO WILL RISK DUPLICATING DATABASE ENTRIES.

//Populate data layer with users from database
db.each('SELECT * FROM users', function(err, row){
	userdb.push(new Userdata(row.username, row.password, row.fullname, new Date(row.DOB), row.job, [], [], [], [], 0, row.country));
});

setTimeout(function(){
//Update users followed from userfollow database
db.each('SELECT * FROM userfollow', function(err, row){
	var followerdex = indexOfUser(row.followername);
	var followeddex = indexOfUser(row.followedname);
	
	if(followerdex != -1 && followeddex != -1){ //Make sure we aren't erroring
	userdb[followerdex].usersfollowed.push(followeddex);
	userdb[followeddex].usersfollowing.push(followerdex);
	userdb[followeddex].numusersfollowing = userdb[followeddex].numusersfollowing + 1;
	}
	else{
	console.log("Error: USER(s) NOT FOUND" );
	console.log(row.followername);
	console.log(row.followedname);
	}
});
}, 1000);

setTimeout(function(){
//Go through topics, updates which user follows which topic and who likes what topic
db.each('SELECT * FROM topics', function(err, row){
	var topicdex = indexOfTopic(row.topicname);
	var userdex = indexOfUser(row.username);
	if(topicdex < 0){ //Handle if this is the first time we see this topic
		var newTopic = new Topicdata(row.topicname, [], []);
		topicdb.push(newTopic);
		topicdex = indexOfTopic(row.topicname);
	}
	if(row.username === ""){ //Our blank topic
		return;
	}
	if(topicdex != -1 && userdex != -1){ //NO ERRORS
	userdb[userdex].topics.push(topicdex);
	topicdb[topicdex].users.push(userdex);
	}
	else{
		console.log("Cannot find user or topic");
	}
});
}, 3000);

setTimeout(function(){
//Go through twitt, do topic-twitt bindings
db.each('SELECT DISTINCT tw.username, tw.fullname, tw.content, tw.twittdate FROM twitts AS tw JOIN users AS u', function(err, row){
	var topics = generateTopics(row.content);
	var userdex = indexOfUser(row.username);
	for (var i = 0; i < topics.length; i++){
		var topicdex = indexOfTopic(topics[i]);
		var twittdex = indexOfTwitt(row.content, row.username);
		if(twittdex < 0){
			twittdb.push(new Twittdata(new Date(row.twittdate), row.content, row.username, [], row.fullname));
			var twittdex = indexOfTwitt(row.content, row.username);
		}
		
		if(topicdex < 0){ //Handle if this is first time seeing this topic
			var newTopic = new Topicdata(row.topicname, [], []);
			topicdb.push(newTopic);
			topicdex = indexOfTopic(row.topicname);
		}
		if(topicdex != -1 && twittdex != -1){ //NO ERRORS. 
			twittdb[twittdex].topics.push(topicdex);
			topicdb[topicdex].twitts.push(twittdex);
		}
		else{
			console.log('DB ERROR. THINGS CANNOT BE FOUND');
		}
	}
	if(userdex != -1 && twittdex != -1){
			userdb[userdex].twitts.push(twittdex);
		}
		else{
			console.log('ASync mishap');
		}
});
}, 5000);

//Copied and pasted from the topic library so we can use it here. Generates topics from given content.
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