'use strict';

var config_master = require(__dirname + '/../config/master.js');
var users = global.nss.db.collection('users');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var _ = require('lodash');
var request = require('request');

class User{
  static create(obj, fn){
    var temp = new User();
    temp.githubId = obj.id;
    temp.username = obj.username;
    temp.email = obj.emails[0].value;
    temp.deployed = [];
    users.save(temp, ()=>fn(temp));
  }

  static findById(id, fn){
    Base.findById(id, users, User, fn);
  }

  static findByGitId(id, fn){
    users.findOne({githubId:id}, (err, user)=>{
      if(user){
        user = _.create(User.prototype, user);
        fn(user);
      }else{
        fn(null);
      }
    });
  }

  getGitRepos(fn){
    var url = `https://api.github.com/users/${this.username}/repos?per_page=100&page=0?${config_master.github.accessToken}`;
    request({headers:{'User-Agent':'nodehub'}, url:url}, (err, response, body)=>{
      var repos = JSON.parse(body);
      repos = repos.map(r=>r.name);
      fn(repos);
    });
  }
}

module.exports = User;
