var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Passports = require('../passports');
var User = require('../models/user');
var userPassport = Passports(User, 'User');
var moment = require('moment');

module.exports = function(app) {
	app.get('/login', function(req, res) {
		if (req.isAuthenticated()) {
			return res.redirect("/");
		} else {
			var redirectUrl = req.session.redirectedUrl;
			req.session.redirectedUrl = null;
			res.header("Cache-Control", "no-cache, no-store, must-revalidate");
			res.header("Pragma", "no-cache");
			res.header("Expires", 0);
			return res.render('login', {
				title : 'Login',
				redirectUrl: redirectUrl,
			});
		}
	});

	app.post('/saveUser', function(req, res) {
		var phone = req.body.phone;
        User.findOne({
            phone: phone,
        }, function(err, user) {
            if(!user) {
                var newUser = new User({
                    phone: phone,
                });
                newUser.save(function(err, u) {
                    if(!err) {
                        req.logIn(u, function(err) {
                            if(err) {
                                console.log(err);
                                return res.json({status: 0, msg: "Login Failed"});
                            }
                            res.cookie('connect.sid', req.cookies['connect.sid'] , {
                                maxAge : 315360000000,
                            });
                            res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                            res.header("Pragma", "no-cache");
                            res.header("Expires", 0);
                            return res.json({
                                status: 1,
                                Msg: "Verified",
                            });
                        });
                    }
                    else {
                        console.log("Error "+ err);
                        return res.json({
                            status: 0,
                            Msg: err,
                        })
                    }
                });
            } else {
                req.logIn(user, function(err) {
                    if(err) {
                        console.log(err);
                        return res.json({status: 0, msg: "Login Failed"});
                    }
                    res.cookie('connect.sid', req.cookies['connect.sid'] , {
                        maxAge : 315360000000,
                    });
                    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                    res.header("Pragma", "no-cache");
                    res.header("Expires", 0);
                    return res.json({
                        status: 1,
                        Msg: "Verified",
                    });
                });
            }
        });
	})
	
	app.get('/logout',function (req, res){
		res.header("Cache-Control", "no-cache, no-store, must-revalidate");
		res.header("Pragma", "no-cache");
		res.header("Expires", 0);
		req.logout();
		res.redirect('/login');
	});
}