exports.checkIfSecure = function(req, res) {
	if(!req.isAuthenticated()) {
		res.redirect('/login');
		return false;
	}
	return true;
}