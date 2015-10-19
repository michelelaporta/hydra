var express = require('express'),
routes    = require('./routes'),
about = require('./routes/about'),
graph = require('./routes/graph'),
config = require('./utils/config'),
crud = require('./utils/crud'),
path = require('path');
var app =  express();

//module.exports = function(width) {
//  return {
//    area: function() {
//      return width * width;
//    }
//  };
//}

exports.expressSetup = function() {
	  
		app.set('port', process.env.PORT || 3000); 
		app.set('domain', '0.0.0.0');
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');
		app.use(express.bodyParser()); // <-- add
		app.use(express.static(path.join(__dirname, 'public')));
		
		app.configure('development', function(){
		  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
		});
		
		app.configure('production', function(){
		  app.use(express.errorHandler()); 
		});
		
		// Routes
		app.get('/', routes.index);
		app.get('/about', about.list);
		app.get('/graph', graph.show);
		app.get('/:collection',crud.get);
		return app;
	  
	};
	
exports.expressSetup2 = function() {
	console.log('expressSetup2');  
	return app;
  
};

