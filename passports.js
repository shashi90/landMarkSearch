var Passport = require('passport').Passport
var LocalStrategy = require('passport-local').Strategy
var RememberMeStrategy = require('passport-remember-me').Strategy

var userConfig = require('./cookie').user
var adminConfig = require('./cookie').admin
var moment = require('moment')

var instances = {}

var randomString = function(len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

var getIssueToken = function(model) {
  return function(user, fn) {
    var token = randomString(64);
    model.findById(ObjectId(user._id), function(err, user) {
      if (err)
        return fn(err)

      if (!user)
        return fn('No User')

      // temp fix
      if (!user.token)
        user.token = token
      user.save(function(err) {
        return fn(null, user.token)
      })
    })
  }
}

function getInstance(model, strategy) {
  if (instances[strategy])
    return instances[strategy]
  var instance = new Passport()
  if (strategy == 'User') {
    // Local Strategy -- passport-local-mongoose
    instance.use(model.createStrategy());
    instance.serializeUser(model.serializeUser());
    instance.deserializeUser(model.deserializeUser());

    var time = moment().add(userConfig.cookie.expires.t, userConfig.cookie.expires.ty)
                    .toDate()
    var userOpts = { path: userConfig.cookie.domain,  expires: time, maxAge : null, httpOnly:null }
    instance.use(new RememberMeStrategy(
      {cookie : userOpts},
      function(token, done) {
        model.findOne({token : token}, function(err, user) {
          if (err)
            return done(err)

          if(!user)
            return done(null, false)

          return done(null, user)
        });
      },
      getIssueToken(model)
    ));
  } else if (strategy == 'Admin') {
    instance.use(model.createStrategy());
    instance.serializeUser(model.serializeUser());
    instance.deserializeUser(model.deserializeUser());

    var time = moment().add(adminConfig.cookie.expires.t, adminConfig.cookie.expires.ty)
                    .toDate()
    var adminOpts = { path: adminConfig.cookie.domain,  expires: time, maxAge : null, httpOnly:null }
    instance.use(new RememberMeStrategy(
      {cookie : adminOpts},
      function(token, done) {
        model.findOne({token : token}, function(err, user) {
          if (err)
            return done(err)

          if(!user)
            return done(null, false)

          return done(null, user)
        });
      },
      getIssueToken(model)
    ));
  }
  instance.serializeUser(function(user, done) {
    done(null, user.id);
  });

  instance.deserializeUser(function(id, done) {
    model.findById(id, function (err, user) {
      done(err, user);
    });
  });
  instances[strategy] = instance
  return instance;
}

module.exports = getInstance;