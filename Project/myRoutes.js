 //###myRoutes.js
 //This file acts as a sort of index for the routes contained within the various files in ./routes.
 //		That way, we can "require" only this file in the app.js file. Also, if anything moves then we
 //		can simply update its path here to reflect the change. Think of this as pointers to route files.
 //
 //	One "gotcha": this is named 'myRoutes.js' instead of 'routes.js' because otherwise the default router
 //		will be used (think /TeamBrettonWoods/node_modules/express/lib/router/index.js) and thus this won't work.

//###Makes this entire file available to app.js
exports.routes = require('./routes');
//###Redirects to the login page on request of '/login'
exports.login = require('./routes/user_sessions');
//###Redirects to the home page on request of '/homepage'
exports.homepage = require('./routes/home_page');
//###Redirects to the profile page on request of '/profilepage', or '/followuser/:userviewed', or '/unfollowuser/:userviewed'
exports.profilepage = require('./routes/profile_page');
//###Redirects to the topic page on request of '/topicview/:topicname', '/unliketopic/:topicname', or '/liketopic/:topicname'
exports.topicpage = require('./routes/topic_page');
//###Isn't used for anything yet, but soon will be.
exports.user = require('./lib/user');
exports.chatpage = require('./routes/chat_page');
//###Redirects to the home page (/homepage) on request of "/"
exports.home = require('./routes/home_redirect'); 
//###Essential to login authentication. Performs utility functions. Redirects to the login page on request of '/logout', and either the login or homepage on request of '/user/auth'. 
exports.sessions = require('./routes/user_sessions'); 
//###Redirects to the search page on request of '/search'
exports.searchPage = require('./routes/search_page');
//###Redirects to the register page for new users
exports.registrypage = require('./routes/registry_page');
//###Redirects to the birthday page on request of '/profilepage/birthdaypage'
exports.birthdaypage = require('./routes/birthday_page'); 
//###Redirects to the discovery page 
exports.discoverpage = require('./routes/discover_page');
//###Redirects to the hangout page
exports.hangoutpage = require('./routes/hangout_page');


exports.http = require('http');
exports.path = require('path');
