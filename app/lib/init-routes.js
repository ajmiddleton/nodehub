'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var deploy = traceur.require(__dirname + '/../routes/deploys.js');
  var cookieParser   = require('cookie-parser');
  var session        = require('express-session');
  var passport       = require('passport');
  traceur.require(__dirname + '/../config/passport.js')(passport);

  app.use(cookieParser());
  app.use(session({secret:'TkG Mars'}));
  app.use(passport.initialize());
  app.use(passport.session());

  //=============== PASSPORT STUFF ================//
  app.get('/auth/github', dbg, passport.authenticate('github'), (req, res)=>{});
  app.get('/auth/github/callback', dbg, passport.authenticate('github', {failureRedirect:'/'}), (req, res)=>{
    res.redirect('/repos');
  });
  app.get('/logout', dbg, (req, res)=>{
    req.logout();
    res.redirect('/');
  });
  //==============================================//

  app.get('/', dbg, home.index);

  //===============AUTHENTICATION REQUIRED========//
  app.all('*', dbg, users.bounce);
  app.get('/repos', dbg, users.repos);

  app.get('/deploy/restartProxy', dbg, deploy.restartProxy);
  app.get('/deploy/:repo', dbg, deploy.new);
  app.get('/deploy/:id/show', dbg, deploy.show);
  app.get('/deploy/:repo/check', dbg, deploy.check);
  app.post('/deploy', dbg, deploy.create);

  console.log('Routes Loaded');
  fn();
}
