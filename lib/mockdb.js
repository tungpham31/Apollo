//#Mock Database! 
//###This database gives the functionality of a real one, but it's not permanent. 

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

//###Create a new user
exports.createUser = function(username, password, fullname, job, dob, country){
	var newuser = new Userdata(username, password, fullname, dob, job, [], [], [], [], 0, country);
	exports.userdb.push(newuser);
}

//###Database of user data
exports.userdb = [
//Fields are:  Username, Password, Full name, Date of Birth, Job, Twittlist, Topiclist, Userlist, People Following, Country
  new Userdata('tim',   'mit', 'Timothy Richards', new Date("April 28, 1993 00:00:00"), 'Professor', [0, 2], [0], [1, 2, 3], [1, 2, 4, 5, 6, 7, 8, 9], 8, 'United States'),
  new Userdata('tungpham31', 'tung', 'Tung Pham', new Date("April 29, 1993 00:00:00"),'Software Engineer', [1], [0, 1], [0], [0, 2], 2, 'Vietnam'),
  new Userdata('joe', 'joe', 'Joseph Leclerc', new Date("April 30, 1990 00:00:00"),'Computer Scientist', [3, 4], [], [0, 1], [0], 1, 'Canada'),
  new Userdata('janny', 'janny', 'Thu Do', new Date("April 31, 1989 00:00:00"),'Economist', [5, 6], [1], [], [0], 1, 'Mexico'),
  new Userdata('davidbeckham', 'tung', 'Tung Pham', new Date("July 29, 1993 00:00:00"),'Software Engineer', [], [], [], [0], 1, 'China'),
  new Userdata('batman', 'tung', 'Tung Pham', new Date("July 29, 1993 00:00:00"),'Software Engineer', [], [], [], [0], 1, 'RU'),
  new Userdata('redsox', 'tung', 'Tung Pham', new Date("July 29, 1993 00:00:00"),'Software Engineer', [], [], [], [0], 1, 'RU'),
  new Userdata('bombingsuspect', 'tung', 'Tung Pham', new Date("July 29, 1993 00:00:00"),'Software Engineer', [], [], [], [0], 1, 'Canada'),
  new Userdata('bostonPD', 'tung', 'Tung Pham', new Date("July 29, 1993 00:00:00"),'Software Engineer', [], [], [], [0], 1, 'United States'),
  new Userdata('watever', 'tung', 'Tung Pham', new Date("July 29, 1993 00:00:00"),'Software Engineer', [], [], [], [0], 1, 'RU')
];

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

//###Twitt database
exports.twittdb = [
	new Twittdata(new Date("March 9, 1989 20:10:22"), "I like #turtles", "tim", [1], 'Timothy Richards'),
	new Twittdata(new Date("March 11, 1989 21:10:33"), "#Dinosaurs are good", "tungpham31", [0], 'Tung Pham'),
	new Twittdata(new Date("March 24, 2011 08:00:21"), "I like #dinosaurs too", "tim", [0], 'Timothy Richards'),
	new Twittdata(new Date("May 11, 1902 00:00:01"), "#v Remember remember, the fifth of november", "joe", [2], 'Joseph Leclerc'),
	new Twittdata(new Date("May 11, 1902 00:00:44"), "#v The gunpowder, treason, and plot", "joe", [2], 'Joseph Leclerc'),
	new Twittdata(new Date("May 11, 1902 00:01:30"), "#v I see no reason that the fifth of november", "janny", [2], 'Thu Do'),
	new Twittdata(new Date("May 11, 1902 00:02:12"), "#v Should ever be forgot", "janny", [2], 'Thu Do')
];

//###Representation of Twitt object in database
function Twittdata(date, content, poster, topiclist, postername){
	this.date = date; //Date made, just a string, not a date object
	this.content = content; //Textual content
	this.poster = poster; //Username of posting user
	this.topics = topiclist; //List of topic numbers this belongs to, index numbers
	this.postername = postername; //FULL NAME of poster
};

//###List of topics in mock database
exports.topicdb = [
	new Topicdata("dinosaurs", [1, 2], [0, 1]),
	new Topicdata("turtles", [0], [1, 3]),
	new Topicdata("v", [3, 4, 5, 6], [])
];

//###Creates a new, BLANK topic
//BLANK. MUST MAKE SURE TOPIC IS UNIQUE BEFORE CALLING THIS
exports.createTopic = function(topicName){
	var newTopic = new Topicdata(topicName, [], []);
	exports.topicdb.push(newTopic);
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
//Given a user NUMBER, a list of topic names, Twitt content, and a date (currently a string, should make a date object) 
	var topicnums = [];
	for(var i = 0; i < topics.length; i++){ //Run through every single topic
		var topicnum = indexOfTopic(topics[i]); 
		if(topicnum === -1){ //If topic isn't found, we create a new topic
			topicnums.push(topicdb.length);
			topicdb.push(new Topicdata(topics[i], [], []));
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
}

//###Bind a user number to a topic name. Changes relevant data fields.
exports.bindTopic = function(usernum, topicname){
	var topicnum = indexOfTopic(topicname);
	var usersOfTopic = topicdb[topicnum].users;
	var topicsOfUser = userdb[usernum].topics;
	if(topicnum != -1){ 				//If we find the topic
		usersOfTopic.push(usernum); 	//Add user to the topic
		topicsOfUser.push(topicnum); 	//Add topic to the user
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
	}
}

//###Binds a user to follow another user. Changes relevant data fields. Both are NUMBERS.
exports.bindUser = function(following, followed){
	var isFollowed = userdb[following].usersfollowed.indexOf(followed);
	if(isFollowed === -1){ //If we aren't following the followed guy yet
		userdb[following].usersfollowed.push(followed);
		userdb[followed].usersfollowing.push(following);
		userdb[followed].numusersfollowing = userdb[followed].numusersfollowing + 1;
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
	}
}