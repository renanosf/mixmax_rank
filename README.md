# mixmax_rank

Add rate functionality to your mixmax

![Rate](https://s3-sa-east-1.amazonaws.com/mixmax-rank/mixmax.png)

## Preparation
* Start an amazon ec2 instance
* Install Openssl
* Install Git and Node.js
* [Install](http://redis.io/download) Redis

## Certificates
[Create](http://www.akadia.com/services/ssh_test_certificate.html) a self-signed ssl certificate

You can change the certificate and key location on line 4 of server.js file:

    var privateKey = fs.readFileSync('../server.key','utf8');
    var certificate = fs.readFileSync('../server.crt','utf8');

## Environment Variables
Add HOST and REDIS_HOST environment variables:

    export HOST=http://your-ip/
    export REDIS_HOST=localhost

## Application
Clone this repository:

    git clone https://github.com/renanosf/mixmax_rank

Install packages and start server

    cd mixmax_rank
    npm install
    npm start

## Mixmax Integration
Now go to your mixmax dashboard integrations and add an enhancement

Here are the settings you shoul use:

    Editor Url -> https://your-ip/editor
    Resolver API Url -> https://your-ip/api/resolver
    Activate API Url -> http://your-ip/api/activate
