var utils = require('../utils');
var Message = require('../../models/messages');

exports.saveMessage = function (data, callback) {
	var message = new Message({
		msg: data.msg ? data.msg : "",
		image: data.image ? data.image : "",
		fromServer: data.fromServer,
		user: data.user._id,
	});

	message.save(function(err, m) {
		if(err) {
			console.log(err);
		}
		callback(m);
	})
}

exports.getMessages = function(userId, callback) {
	Message.find({
		user: userId,
	}).exec(function(err, messages) {
		if(err) {
			callback(err, []);
			return;
		}
		callback(null, messages);
	})
}