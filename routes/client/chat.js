
var utils = require('../utils');
var User = require('../../models/user');
var message_helper = require('../helpers/message_helper');
const GoogleImages = require('google-images');
const client = new GoogleImages('016865859412998649348:atqlwk_owxc', 'AIzaSyCUDG9xiQrqCt88mtFCG41YWPQN70vKG7Q');

module.exports = function(app) {
	app.get('/', function(req, res) {
		if(!utils.checkIfSecure(req, res)) return;
		User.update({
			_id: req.user._id,
		}, {
			$set: {
				liveNow: true,
			}
		}, function(err, result) {
			if(err) {
				console.log(err);
			}
		});

		var user = {
			_id: req.user._id,
			phone: req.user.phone,
			avatarUrl: req.user.avatarUrl,
		}

		return res.render("client/chat", {
			user: user,
		})
	});

	app.post('/getlandmark', function(req, res){
		if(!utils.checkIfSecure(req, res)) return;
		var msg = req.body.msg;
		message_helper.saveMessage({msg: msg, user: req.user}, function(m){
			client.search(msg).then(function(images){
				message_helper.saveMessage({image: images[0].url, user: req.user, fromServer: true}, function(ms){
					return res.json(ms);
				})
			})
		})
	})

	app.get('/getMessages', function(req, res) {
		if(!utils.checkIfSecure(req, res)) return;
		message_helper.getMessages(req.user._id, function(err, data) {
			if(err) {
				return res.json([]);
			} else {
				return res.json(data);
			}
		})
	})
}