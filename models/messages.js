var mongoose = require('mongoose')
var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,
	User = require('./user');

var MessageSchema = new Schema({
	msg: String,
	fromServer: {type: Boolean, default: false},
	image: String,
	created: {type: Date, default: Date.now},
	deleted: {type: Date},
	user: {type: ObjectId, ref: 'User', index: true},
});

module.exports = mongoose.model('Message', MessageSchema);