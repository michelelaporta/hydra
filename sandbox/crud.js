var mongoHost = 'localHost'; //A
var mongoPort = 27017; 
var collectionDriver;
var mongoDb = require('mongodb');
var MongoClient = mongoDb.MongoClient;
var MongoServer = mongoDb.Server;
var mongoClient = new MongoClient(new MongoServer(mongoHost, mongoPort));
var CollectionDriver = require('./collectionDriver').CollectionDriver;

var expressServer = require('../server-express');
console.log('expressServer ' +expressServer);
var app = expressServer.expressSetup2();
//console.log('area ' +app);

mongoClient.open(function(err, mongoClient) { //C
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  var db = mongoClient.db("Hydra");  //E
  collectionDriver = new CollectionDriver(db); //F
});

exports.get = function(req, res){
   var params = req.params; //B
   
   collectionDriver.findAll(req.params.collection, function(error, objs) { //C
    	  if (error) { res.send(400, error); } //D
	      else { 
	          if (req.accepts('html')) { //E
    	          res.render('data',{objects: objs, collection: req.params.collection}); //F
              } else {
	          res.set('Content-Type','application/json'); //G
                  res.send(200, objs); //H
              }
         }
   	});
};


//app.get('/:collection', function(req, res) { //A
//   var params = req.params; //B
//   
//   collectionDriver.findAll(req.params.collection, function(error, objs) { //C
//    	  if (error) { res.send(400, error); } //D
//	      else { 
//	          if (req.accepts('html')) { //E
//    	          res.render('data',{objects: objs, collection: req.params.collection}); //F
//              } else {
//	          res.set('Content-Type','application/json'); //G
//                  res.send(200, objs); //H
//              }
//         }
//   	});
//});
// 
//app.get('/:collection/:entity', function(req, res) { //I
//   var params = req.params;
//   var entity = params.entity;
//   var collection = params.collection;
//   if (entity) {
//       collectionDriver.get(collection, entity, function(error, objs) { //J
//          if (error) { res.send(400, error); }
//          else { res.send(200, objs); } //K
//       });
//   } else {
//      res.send(400, {error: 'bad url', url: req.url});
//   }
//});
//
//app.post('/:collection', function(req, res) { //A
//    var object = req.body;
//    var collection = req.params.collection;
//    
//    collectionDriver.save(collection, object, function(err,docs) {
//          if (err) { res.send(400, err); } 
//          else { res.send(201, docs); } //B
//     });
//});
//
//app.put('/:collection/:entity', function(req, res) { //A
//    var params = req.params;
//    var entity = params.entity;
//    var collection = params.collection;
//    if (entity) {
//       collectionDriver.update(collection, req.body, entity, function(error, objs) { //B
//          if (error) { res.send(400, error); }
//          else { res.send(200, objs); } //C
//       });
//   } else {
//	   var error = { "message" : "Cannot PUT a whole collection" }
//	   res.send(400, error);
//   }
//});
//
//app.delete('/:collection/:entity', function(req, res) { //A
//    var params = req.params;
//    var entity = params.entity;
//    var collection = params.collection;
//    if (entity) {
//       collectionDriver.delete(collection, entity, function(error, objs) { //B
//          if (error) { res.send(400, error); }
//          else { res.send(200, objs); } //C 200 b/c includes the original doc
//       });
//   } else {
//       var error = { "message" : "Cannot DELETE a whole collection" }
//       res.send(400, error);
//   }
//});
