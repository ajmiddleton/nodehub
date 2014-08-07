'use strict';

exports.bounce = (req, res, next)=>{
  if(req.isAuthenticated()){
    res.locals.user = req.user;
    return next();
  }else{
    res.redirect('/');
  }
};

exports.repos = (req, res, next)=>{
  var user = res.locals.user;
  user.getGitRepos((repos)=>{
    res.render('users/repos', {repos:repos});
  });
};
