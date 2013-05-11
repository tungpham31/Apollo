var userlib = require('../lib/user');
var user_sessions = require('./user_sessions');
registeredUsername = ''; //This is a global variable for the username you want to create.

//###Display registry page if username is valid
exports.displayPage = function(req,res){
	
	var username = req.body.registeredUsername;
	registeredUsername = username;
	if(userlib.has_user(username))
	{
		    res.render('login_page', {title : 'TWITTIM LOGIN',
                              message : 'This Username has already been taken!',
						  	  resources: '../bin'});
	}
	
	else{
	res.render('registry_page', { title: 'Twittim Registry',
								message : '',
								username : username,
								fullname : '',
								job : '',
								dob : '',
								country : ''
								});
	}
};

//###Go here when we complete registration
exports.completeRegistration = function(req,res){
	var username = registeredUsername;
	var fullname = req.body.fullname;
	var job = req.body.job;
	var dob = req.body.dob;
	var country = req.body.country;
	
	var pw1 = req.body.loginPass;
	var pw2 = req.body.loginPass2;
	var message = '';
	
	//This sees if we filled up everything correctly
	var passauth = true; 
	
	if(!passwordValidate(pw1, pw2)){ //Validate passwords
		message = message + 'Your passwords do no match! ';
		passauth = false;
	}
	
	if(!isValid(fullname)){ //Validate fields
		message = message + 'Please enter your name! ';
		passauth = false;
		fullname = '';
	}
	
	if(!isValid(job)){
		message = message + 'Please enter a job! ';
		passauth = false;
		job = '';
	}
	
	if(!isValid(country)){
		message = message + 'Please enter a valid country! ';
		passauth = false;
		country = '';
	}
	
	var dateofbirth = getDate(dob); //Check if proper DoB, and returns date object
	
	if(dateofbirth === false){
		message = message + 'Please enter a proper date of birth! ';
		passauth = false;
		dob = '';
	}
	
	//Do this if some field is badly filled
	if(passauth === false){
		res.render('registry_page', { title: 'Twittim Registry',
									message : message,
									username : username,
									fullname : fullname,
									job : job,
									dob : dob,
									country : country
									});
	}
	
	//Untested method. In the unlikely event someone registers your username as you're filling this form
	else if(usernameTaken(username)){
		    res.render('login_page', {title : 'TWITTIM LOGIN',
                              message : 'Your Username got taken while you were filling out the form!',
						  	  resources: '../bin'});
	}
	
	else{
			userlib.createUser(username, pw1, fullname, job, dateofbirth, country);
		    res.render('login_page', {title : 'TWITTIM LOGIN',
                              message : 'You have successfully created a new account!',
						  	  resources: '../bin'});
	}
	
}

//###Validate passwords. 
//Right now just checks if they are equal, but can extend to do checking.
//Takes two strings and returns a boolean
function passwordValidate(p1, p2){
	return (p1 === p2);
}
//###Checks if firstname/lastname field is valid. 
//Right now just checks if it's filled in, but can be extended to check for special characters.
//Takes a username string and returns a boolean
function isValid(s){
	return (s.length > 0);
}

//###Checks if username is available
//Takes a username string and returns a boolean
function usernameTaken(u){
	return userlib.has_user(u);
}

//###Takes in String, returns date object
//Also CHECKS FOR VALID INPUT
//It's MM/DD/YYYY. 
function getDate(dob){
	var num = dob.split('/'); //Split into 3 numbers supposedly
	if(num.length != 3) return false; //make sure we have 3 segments
	var m = parseInt(num[0]);
	var d = parseInt(num[1]);
	var y = parseInt(num[2]);

	if(isNaN(m) || m === 0 || isNaN(d) || d === 0 || isNaN(y) || y === 0) return false; //Conversion failure
	if(m < 0 || m > 12) return false; //Month valid
	if(d < 0 || d > 31) return false; //Day valid
	if(y < 1000 || y > 9999) return false; //Year valid
	
	var theDate = new Date("January 1, 1000 00:00:00");
	theDate.setDate(d);
	theDate.setMonth(m-1);
	theDate.setYear(y);
	console.log(theDate);
	
	return theDate; //If nothing fails, it's valid. Return date.
}
