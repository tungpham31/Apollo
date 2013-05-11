//### Redirect current view to home
//Requires a request and a responce object as parameters
exports.home = function (req, res) {
    res.redirect('/login');
}