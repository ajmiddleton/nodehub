// 1. Edit this file to fill in your specific information
// 2. Rename to master.js
module.exports = {
  'domain' : '.yourdomain.net', // notice the '.' that comes before 'yourdomain' -- don't remove it!
  'aws': {
    'access' : {
      'accessKeyId': 'yourAccessKey',
      'secretAccessKey': 'yourSecretAccessKey'
    },
    'hostedZoneId' : '/hostedzone/yourHostedZoneId',
    'ip': 'yourVMIPaddress'
  },
  'github': {
    'clientId': 'yourClientId',
    'clientSecret': 'yourClientSecret',
    'callbackUrl': 'http://nodehub.yourdomain.net/auth/github/callback',
    'accessToken': 'yourAccessToken'
  }
};
