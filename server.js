var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('../server.key','utf8');
var certificate = fs.readFileSync('../server.crt','utf8');
var credentials = {key : privateKey, cert: certificate};
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');

// Serve assets in /public.
app.use(express.static(__dirname + '/public'));

// So we can POST.
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Since Mixmax calls this API directly from the client-side, it must be whitelisted.
var corsOptions = {
  origin: /^[^.\s]+\.mixmax\.com$/,
  credentials: true
};

app.get('/',function(req,res){
	res.status(200).json({status : 1});
});

// The editor interface.
app.get('/editor', function(req, res) {
  res.sendFile(__dirname + '/editor.html');
});

// The in-email representation.
app.post('/api/resolver', cors(corsOptions), require('./api/resolver'));
app.post('/api/activate', cors(corsOptions), require('./api/activate'));

app.get('/vote/:campaign/:rating/:user', require('./api/vote'));
app.get('/view/:campaign', require('./api/view'));

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials,app);

httpServer.listen(80);
httpsServer.listen(443);