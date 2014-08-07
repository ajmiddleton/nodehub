/* jshint unused:false */
'use strict';

var Cookies = require('cookies');
var traceur = require('traceur');
var User;
var Deploy;

exports.connection = function(socket){
  if(global.nss){
    User = traceur.require(__dirname + '/../models/user.js');
    Deploy = traceur.require(__dirname + '/../models/deploy.js');
    addUserToSocket(socket);

    socket.on('deploy', deploy);
  }
};

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
function deploy(data){
  var socket = this;
  console.log(data);
  console.log(socket.nss.user);
  data.user = socket.nss.user;
  Deploy.create(data, newDeploy=>{
    console.log('========BACK FROM CREATE==========');
    console.log(newDeploy);
    socket.emit('deployed', newDeploy);
  });
}

function done(data){
  var socket = this;
  console.log('===================INSIDE DONE=============');
  console.log(data);
  socket.emit('deployed', data);
}

function addUserToSocket(socket){
  var cookies = new Cookies(socket.handshake, {}, ['SEC123', '321CES']);
  var encoded = cookies.get('express:sess');
  var decoded;

  if(encoded){
    decoded = decode(encoded);
  }
  console.log(decoded);
  User.findById(decoded.passport.user, user=>{
    user.socketId = socket.id;
    socket.nss = {};
    socket.nss.user = user;
    // socket.emit('online', user);
    // socket.broadcast.emit('online', user);
  });
}

function decode(string) {
  var body = new Buffer(string, 'base64').toString('utf8');
  return JSON.parse(body);
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
