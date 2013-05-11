//#Topics!
//###Library to include if we want a list of topics
//Handles very little, most commonly used to list topics a user likes, but has other capabilities as well.
var db = require('./mockdb');

//###Internal utility function. Takes in topic name, returns index of topic in database.
function indexOfTopic(name){
	var topicdex = -1;
	for(var i = 0; i < topicdb.length; i++)
	{
		if(topicdb[i].name === name){
			topicdex = i;
		}
	}
	return topicdex;
}

var topicdb = db.topicdb; //For easy reference of mock database with topics.

//###Given name of topic, lists Twitts
exports.listTwitts = function(name){
	var retval = [];
	var twittnum = indexOfTopic(name);
	if(twittnum != -1){
		for(var i = 0; i < topicdb[twittnum].twitts.length; i++){
			retval.push(db.twittdb[topicdb[twittnum].twitts[i]]);
		}
	}
	return retval; //Returns a list of twitts in that topic.
}

//###Given name of topic, lists users who like it
exports.listUsers = function(name){
	var retval = [];
	var twittnum = indexOfTopic(name);
	if(twittnum != -1){
		for(var i = 0; i < topicdb[twittnum].users.length; i++){
			retval.push(db.userdb[topicdb[twittnum].users[i]]);
		}
	}
	return retval; //Returns list of users who subscribe this topic.
}

//###Returns a list of THE NAMES of every topic
exports.listTopics = function(){
	var result = "";
	for(var i = 0; i < topicdb.length; i++){
		result = result + topicdb[i].name + " ";
	}
	return result; //Returns a list of every topic's name
}

//###Returns a list of all topics with matching text
exports.searchTopic = function(find){
	var results = [];
	for(var i = 0; i < topicdb.length; i++){
		var t = topicdb[i];
		if(t.name.indexOf(find) != -1){
			results.push(t);
		}
	}
	return results; //Returns all topics containing the input string.
}

//###Returns a list of all topics' name with matching text
// Topic's name is returned with a '#' in front
exports.searchTopicName = function(find){
	var topics = exports.searchTopic(find);
	var topicnames = [];
	for (var topicId in topics)
		topicnames[topicId] = '#' + topics[topicId].name;

	return topicnames;
}

//### Creates a blank topic with no users
exports.createTopic = function(topicName){
	if(exports.isTopicInDatabase(topicName) === false){ //Double check that topic doesn't exist
		db.createTopic(topicName);
	}
}

//### Determine whether a topic is in topic database
exports.isTopicInDatabase = function(topicName){
	for (var i = 0; i < topicdb.length; i++)
		if (topicdb[i].name === topicName) return true;
	return false;
}
