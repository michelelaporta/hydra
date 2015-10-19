var http = require('http'),
    express = require('express'),
    expressServer = require('./server-express');

var app = expressServer.expressSetup();
console.log('expressServer ' + app);
//console.log('getApp ' + expressServer.getApp());

var app2 = expressServer.expressSetup2();
console.log('expressServer2 ' + app2);

var server = http.createServer(app);

var io=require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on '+app.get('domain')+ ':' + app.get('port'));
});



