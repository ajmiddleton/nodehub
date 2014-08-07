/* jshint unused:false */
'use strict';

var deployed = global.nss.db.collection('deployed');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var cp = require('child_process');
var fs = require('fs');
var rimraf = require('rimraf');
var jf = require('jsonfile');
var AWS = require('aws-sdk');
var configMaster = require(__dirname + '/../config/master.js');
AWS.config.update(configMaster.aws.access);
var route53 = new AWS.Route53();

class Deploy{
  static create(obj, fn){
    var newDeploy = new Deploy();
    newDeploy.name = obj.name;
    newDeploy.dbname = `${obj.user.username}-${obj.name}`;
    newDeploy.owner = obj.user.username;
    newDeploy.repo = obj.repo;
    newDeploy.repoUrl = `https://github.com/${obj.user.username}/${obj.repo}`;
    newDeploy.port = 0;

    //==============RUN SCRIPTS==========//
    newDeploy.cloneAndInstall((cloneResults)=>{
      newDeploy.updateProxy(()=>{
        Deploy.addRecordSet(newDeploy.name + configMaster.domain, (recordResults)=>{
          newDeploy.processManagement((processResults)=>{
            var results = cloneResults + recordResults + processResults;
            newDeploy.results = results;
            deployed.save(newDeploy, ()=>fn(newDeploy));
          });
        });
      });
    });
  }

  static findById(id, fn){
    Base.findById(id, deployed, Deploy, fn);
  }

  static restartProxy(){
    cp.exec('pm2 restart proxy', (err, stdout, stderr)=>{
      console.log('=====RESTART PROXY=====');
      console.log(err);
      console.log(stdout);
      console.log(stderr);
    });
  }

  static checkDomain(domain, fn){
    deployed.findOne({name:domain}, (err, domain)=>{
      if(domain){
        fn(false);
      }else{
        fn(true);
      }
    });
  }

  static addRecordSet(domain, fn){
    console.log('===========INSIDE ADDRECORDSET===========');
    console.log(domain);
    var params = {
      'HostedZoneId': configMaster.aws.hostedZoneId,
      'ChangeBatch': {
        'Changes': [
          {
            'Action': 'CREATE',
            'ResourceRecordSet': {
              'Name': domain,
              'Type': 'A',
              'TTL' : 86400,
              'ResourceRecords':[
                {
                  'Value': configMaster.aws.ip
                }
              ]
            }
          }
        ]
      }
    };

    route53.changeResourceRecordSets(params, (err, data)=>{
      console.log('=======AWS CALLBACK========');
      console.log(err, data);
      var output = `ERR:${err}
                    DATA:${data}`;
      fn(data);
    });
  }

  processManagement(fn){
    var ownerDir = __dirname + `/../../../${this.owner}`;
    var repoDir = `${ownerDir}/${this.repo}`;
    runStartNewProcess(this.port, this.dbname, this.name, repoDir, fn);
  }

  cloneAndInstall(fn){
    var deploy = this;
    var ownerDir = __dirname + `/../../../${this.owner}`;
    var repoDir = `${ownerDir}/${this.repo}`;

    if(fs.existsSync(ownerDir)){
      rimraf(repoDir, ()=>{
        console.log('removed old repo directory');
        runClone(deploy.repo, deploy.repoUrl, ownerDir, fn);
      });
    }else{
      fs.mkdir(ownerDir, ()=>{
        runClone(deploy.repo, deploy.repoUrl, ownerDir, fn);
      });
    }
  }

  updateProxy(fn){
    var deploy = this;
    jf.readFile(__dirname + '/../options.json', (err, options)=>{
      var keys = Object.keys(options);
      var lastKey = keys[keys.length-1];
      var nextPort = (options[lastKey].split(':')[2] * 1) + 1;
      var domain = deploy.name + configMaster.domain;
      options[domain] = `http://localhost:${nextPort}`;
      deploy.port = nextPort;
      jf.writeFile(__dirname + '/../options.json', options, err=>{
        console.log('=========JSON WRITEFILE ERROR=========');
        console.log(err);
        fn();
      });
    });
  }
}

function runClone(repo, url, cwd, fn){
  console.log('ENTER RUNCLONE==========');
  cp.execFile(__dirname + '/../lib/cloneAndInstall.sh',
    [repo, url],
    {cwd:cwd},
    (err, stdout, stderr)=>{
      console.log('RUNCLONE OUTPUT==========');
      console.log(err);
      console.log(stderr);
      console.log(stdout);
      var output = `ERR:${err}
                    STDERR:${stderr}
                    STDOUT:${stdout}`;
      fn(output);
    }
  );
}

function runStartNewProcess(port, dbname, name, cwd, fn){
  console.log('ENTER STARTNEWPROCESS========');
  cp.execFile(__dirname + '/../lib/startNewDeploy.sh',
    [port, dbname, name],
    {cwd:cwd},
    (err, stdout, stderr)=>{
      console.log('STARTNEWPROCESS OUTPUT========');
      console.log(err);
      console.log(stderr);
      console.log(stdout);
      var output = `ERR:${err}
                    STDERR:${stderr}
                    STDOUT:${stdout}`;
      fn(output);
    }
  );
}

module.exports = Deploy;
