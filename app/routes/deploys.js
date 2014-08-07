'use strict';

var traceur = require('traceur');
var Deploy = traceur.require(__dirname + '/../models/deploy.js');

exports.new = (req, res)=>{
  res.render('deploys/new', {title: 'Configure Deploy', repo:req.params.repo});
};

exports.check = (req, res)=>{
  Deploy.checkDomain(req.params.repo, status=>{
    res.send({status:status});
  });
};

exports.create = (req, res)=>{
  req.body.user = res.locals.user;
  Deploy.create(req.body, (deployed, results)=>{
    console.log('======RENDER DEPLOYS/SHOW==========');
    console.log(deployed);
    res.render('deploys/show', {title:'Show Deploy', results:results, deployed:deployed}, (e, html)=>{
      console.log('=======================RENDER DEPLOYS/SHOW ERROR=========================');
      console.log(e);
      res.send({html:html});
    });
  });
};

exports.show = (req, res)=>{
  Deploy.findById(req.params.id, dep=>{
    res.render('deploys/show', {title:'Show Deploy', results:dep.results, deployed:dep});
  });
};

exports.restartProxy = (req, res)=>{
  Deploy.restartProxy();
  res.send({status:1});
};
