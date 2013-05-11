//### Import libraries
var userlib = require('../lib');
var user_sessions = require('./user_sessions');
var topiclib = require('../lib/topic');

//### Display the Search Result Page
/*Three things will be included in this page
  1: The navigation button to Home and Profile, and Logout
  2: The Users Who Are Related To The Keyword
  3: The Topics Containing The Keyword	*/
//Requires a request and a responce object as parameters
exports.displayPage = function(req,res){
	//Checks if the user is logged in already
	var user  = req.session.user;
	if (user === undefined || !user_sessions.isUserOnline(user.username)){
		req.flash('auth', 'Not logged in!');
		res.redirect('/login');
		return;
	}

	//Gets the keyword from the request's body
	var originalKeyword = req.body.keyword;
	var keyword = originalKeyword;

	//Edit keyword in the correct form
	if (keyword[0] === '@' || keyword[0] === '#') keyword = originalKeyword.substr(1);

	if (req.body.from !== "instant search"){
		//Searches the user database for this particular keyword
		result = userlib.searchUsersWithKeyword(keyword);
		//Searches the topic database for this particular keyword
		result2 = topiclib.searchTopic(keyword);
		//Renders a Search Result view with this information
		res.render('search_result_page', { title: 'Search Result',
										usersFound : result,
										topicsFound : result2,
										key : originalKeyword });
	}
	else{
		//Search user database for this particular keyword (return usernames)
		var result1 = userlib.searchUsernamesWithKeyword(keyword);
		var result2 = topiclib.searchTopicName(keyword);
		var result = result1.concat(result2);
		// Set content type to be json:
   		res.contentType('application/json');
    	res.send({data : result});
	}
};