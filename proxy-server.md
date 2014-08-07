var httpProxy = require('http-proxy')
var proxy = httpProxy.createProxy();
var jf = require('jsonfile');
var options = jf.readFileSync(__dirname + '/../nodehub/app/options.json');

require('http').createServer(function(req, res) {
  try{
    proxy.web(req, res, {target: options[req.headers.host]}, function(e){console.log(e);});
  }catch(e){
    console.log('Proxy Server encountered an error.');
    console.log(e);
  }
}).listen(3000);

