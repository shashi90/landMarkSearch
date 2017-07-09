var mongoose = require('mongoose')
var Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,
	passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  phone: {type: String, required: true, unique: true},
  //name: {type: String, required: true},
  avatarUrl: {type: String, default: 'http://52.74.85.56:3000/admin/assets/admin/layout/img/avatar.png'},
  //email: String, //shajahan2000@hotmail.com,
  hash : String,
  liveNow: {type: Boolean, default: false},
  token : String,
	salt : String,
  cusvisit: Number, //1,
  status: Number, //1,
  approved: Boolean, //1 ??,
  ip: [String], //122.164.120.152,
  date_added: {type: Date, default: Date.now}, //2009-08-20 00:00:00,
  privilege: Number,
  theme: {
    tC: {type: String, default: ""},
  }
})

UserSchema.plugin(passportLocalMongoose, {
	usernameField : 'phone'
});

module.exports = mongoose.model('User', UserSchema);