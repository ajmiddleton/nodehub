# Server Setup

### File Structure and Installation
1. Clone this repo to your code directory.
Preferably, nodehub will be used to install all other applications.
Your file structure should look like this.

        -code
          -proxy-server
          -nodehub
2. Edit your proxy-server app.js to look like this:
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
    You may notice that all your subdomain options have disappeared!
    The proxy server is now configured to look for an options.json file in nodehub/app.
    If you would like to add some options manually, you may edit that file. However, be aware that nodehub
    is configured to run on port 5000 by default, and when adding new projects to the options list, it will increment the port
    number of the last option by 1 to produce a new port number.
3. Add "jsonfile" as a dependency in your proxy-server app.js, and run "npm install".
4. Run "npm run nss" in the nodehub directory.
5. Run grunt.

### Generating your access keys
Take a look at nodehub/app/config/example-master.js. Nodehub requires you
to generate several access keys relating to your AWS and GitHub accounts to work.
These will allow nodehub to first access information about your github, and second
create a subdomain or record set.

Replace the placeholders in this file with your information.
It is absolutely ***CRUCIAL*** that you then rename this file to "master.js".
Not only is "master.js" used in the application, but it has been added to the .gitignore
file so that your personal information is not leaked onto github.

For GitHub:
1. Log into github.com and click on "Account Settings" in the top right corner.
2. Under Developer Applications, click on **Register new application.**
3. Name the application nodehub, fill in whatever descriptions you'd like, and enter
**"nodehub.[yourdomain.com]/auth/github/callback"** as the authorization callback url.
4. This will produce your github clientId and clientSecret in master.js.
5. Now, click **Generate new token** next to Personal access tokens. This will produce your accessToken in master.js.

For AWS:
1. Log into your AWS management console and click on **IAM.**
2. Then click on **Users** and then **Create New User**
3. This will generate accessKeyId and secretAccessKey.
4. Now go back to the main console and navigate to **Route 53**.
5. Click on **Hosted Zones** to view your domains. Your HostedZoneId will be listed here.
6. Select your hosted zone, and click **Go To Record Sets**. The ip address for your VM will be listed here.
7. While in your record sets, add one for "nodehub". (eg. nodehub.yourdomain.com)

Nodehub should be configured and ready to go! Don't forget to rename example-master.js to master.js ;)

### Adding a nodehub script to your projects
Any project that you want to deploy must include a "nodehub" script in your package.json.
For most purposes, this will just include "npm install" (or "npm run nss" for us NSS students).
Any other custom installation commands should go here.

### Starting Nodehub
Nodehub is intended to only be run on an as-needed basis. In its default configuration,
there is no check for specific github users, so anyone with a valid github account could technically deploy
to your server.

1. navigate to code/nodehub
2. start the process with PORT=5000 DBNAME=nodehub node app/app.js
3. use nodehub to deploy your latest app.
4. stop the nodehub process.
