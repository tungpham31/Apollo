var userlib = require('../lib/user');
var user_sessions = require('./user_sessions');
var topiclib = require('../lib/topic');
var twittlib = require('../lib/twitt');
var database = require('../lib/mockdb');

//###Display discover page after checking user's auth status
//Requires a request and a response object as parameters
exports.displayPage = function(req,res){
	//Check if user is logged in already
	if(sessCheck(req, res) === true){
		trendingTopics = findTrendingTopics();
		whoToFollow = findPeopleToFollow(req.session.user);

		res.render('discover_page', { title: 'Twittim Discover Page',
									  trendingTopics : trendingTopics,
									  whoToFollow : whoToFollow});
	}
	else{
		req.flash('auth', 'Please log in. ');
		res.redirect('/login');
	}
};

//### Get the people that this user should follow.
// Those people should not be someone he already follows or himself.
findPeopleToFollow = function(user){
	// get a list of all user
	var people = [];
	for (var i in database.userdb){
		people.push(i); 
	} 
	//Make a deep clone very inefficiently. Previous implementation was literally changing the order of database.
	var people = database.userdb;
	people.sort(function(person1, person2){
		if (person1.numusersfollowing >= person2.numusersfollowing) return -1;
		return 1;
	})

	var peopleToFollow = [];
	var counter = 0;
	for (var i in people){
		if (user.username !== people[i].username){
			if (!userlib.followsUsername(user.username, people[i].username)){
				counter++;
				peopleToFollow.push(people[i].username);
				if (counter === 10) break;
			}
		}
	}
	return peopleToFollow;
}

//###Get the followers database of the current logged-in user
exports.getFollowers = function(req, res){
	//Check if user is logged in already
	if (sessCheck(req, res) === true){
		var user = req.session.user;
		var followers = userlib.findFollowersWithUsername(user.username);
		var message = {data : followers};
		// Set content type to be json:
   		res.contentType('application/json');
    	res.send(message);
	}
	else{
		req.flash('auth', 'Please log in. ');
		res.redirect('/login');
	}
}

//###Find trending topics in the database
findTrendingTopics = function(){
	topics = database.topicdb;
	//Sorts the topics in popularity order
	topics.sort(function(topic1, topic2){
		// Choose topic with more twitts related to it
		if (topic1.twitts.length > topic2.twitts.length) return -1;
		return 1;
	});

	results = [];
	for (var i = 0; i < Math.min(10, topics.length); i++){
		results[i] = topics[i].name;
	}

	return results;
}