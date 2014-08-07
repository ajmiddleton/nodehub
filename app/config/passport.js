'use strict';
var configMaster = require(__dirname + '/master.js');
var GITHUB_CLIENT_ID = configMaster.github.clientId;
var GITHUB_CLIENT_SECRET = configMaster.github.clientSecret;
var GitHubStrategy = require('passport-github').Strategy;
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');


module.exports = (passport)=>{
  passport.serializeUser((user, done)=>{
    done(null, user._id);
  });

  passport.deserializeUser((id, done)=>{
    User.findById(id, user=>{
      done(null, user);
    });
  });

  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: configMaster.github.callbackUrl
    },
    (accessToken, refreshToken, profile, done)=>{
      process.nextTick(()=>{
        console.log(profile);
        User.findByGitId(profile.id, user=>{
          if(user){
            return done(null, user);
          }else{
            User.create(profile, user=>{
              return done(null, user);
            });
          }
        });
      });
    }
  ));

};
