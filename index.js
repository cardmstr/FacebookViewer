var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var secrets = require('./secrets');

var app = module.exports = express();
var port = process.env.PORT || 3000;

app.use(session({
  secret: secrets.appSecret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new FacebookStrategy({
  clientID: secrets.facebookID,
  clientSecret: secrets.facebookKey,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'gender', 'displayName', 'photos', 'email', 'birthday','age_range','first_name','middle_name','last_name']
}, function(token, refreshToken, profile, done){
  //console.log(profile);
  return done(null, profile);
}));

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  done(null, obj);
})

//get friends var authScope = { authType: 'rerequest', scope: ['user_friends']};
app.get('/auth/facebook', passport.authenticate('facebook'/*, authScope*/));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/me',
  failureRedirect: '/auth/facebook',
  scope: ['email','gender','birthday','age_range','first_name','middle_name','last_name']
}), function(req,res){
  console.log(req.session);
});

app.get('/me', function(req, res){
  //console.log(req);
  res.send(req.user._json);
})






app.listen(port, function(){
  console.log('listening on port ' + port);
});
