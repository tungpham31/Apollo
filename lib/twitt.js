//#Twitt Library
//###Use to test and look at twitts.
//Twitts exist mostly in relation to topics and users, so this library could go mostly unused.
var db = require('./mockdb'); //First include the mock database
var testdate = ("10/03/2013, 20:13:14"); //And have a fake date as a string, not a real date object.
var twittdb = db.twittdb;  //Setup knowledge of the mock database of Twitts.

//###Return all Twitts in the database
function getTwitts(){
  var result = "";
  for(var i = 0; i < twittdb.length; i++){
    result = result + twittdb[i].content + " ";
  }
  return result; //Right now listing operates as a stack
}

//###Lists every single Twitt ever
exports.listTwitts = function(){
  var result = [];
  for(var i = 0; i < twittdb.length; i++){
    result.push(twittdb[i]);
  }
  return result;
}

//###Takes in a twitt as a string, returns with topic links.
//Input: String. Output: String with topics as links
function generateTopicLinks(twitt){
	var retval = "";
	var split = twitt.content.split(" ");
	for(var i in split) { 
		if(split[i].indexOf("#") === 0){  		
			split[i].anchor("/topicview/" + split[i].slice(1, split[i].length));
		}
		retval = retval + split[i] + " ";
	}
	return retval;
}

//###Takes in a LIST of twitts, and outputs a LIST of strings
//THIS FUNCTION ISN'T USED 
//Input: List of Twitts. Output: List of strings with hyperlinks
exports.generateLinks = function(twitts){
	var retval = [];
	for(var i in twitts){
		retval.push(generateTopicLinks(twitts[i]));
		}
		return retval;
}

//###Internal method to get the last instance of a Twitt matching some content.
function lastIndexOfTwitt(content){
	var twittdex = -1;
	for(var i = 0; i < twittdb.length; i++)
	{
		if(twittdb[i].content === content){
			twittdex = i;
		}
	}
	return twittdex;
}

//###Takes in a twitt number, returns the Twitt from database
exports.getTwitt = function(twittnum){
	return twittdb[twittnum];
}

//###To list every single Twitt in the database, as of yet unused. A testing method.
exports.list = function(req, res){
  res.send("" + getTwitts()); 
};

//###To write twitt in standard form
exports.twittToString = function(twitt){
	var edittedTwitt = "On " + twitt.date.toLocaleDateString() + ", " + twitt.date.toLocaleTimeString() + ", you twitted:";
	var split = twitt.content.split(' ');
	for (var i in split)
		if (split[i].indexOf('#') == 0)
			edittedTwitt += ' <a href="/topicview/' + split[i].slice(1, split[i].length).toLowerCase() + '">' + split[i] + '</a>';
		else if (split[i].indexOf('@') == 0)
			edittedTwitt += ' <a href="/userview/' + split[i].slice(1, split[i].length).toLowerCase() + '">' + split[i] + '</a>';
		else edittedTwitt += ' ' + split[i];
	return edittedTwitt;
};