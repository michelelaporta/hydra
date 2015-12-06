var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    url = require( "url" );

//parse application/json
//router.use(bodyParser.json())

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))


//build the REST operations at the base for planner
//this will be accessible from https://127.0.0.1:4443/planner if the default route for / is left unchanged
router.route('/')
    //GET all preferences
    .get(function(req, res, next) {
        //retrieve all preferences from Monogo
        mongoose.model('Planner').find({}, function (err, planner) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                    html: function(){
                        res.render('planner/index', {
                              title: 'Planner',
                              events: planner
                              //,"planner" : preferences
                          });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(planner);
                    }
                });
              }     
        });
    })
    //POST a new planner
    .post(function(req, res) {
    	
    	var datJson = JSON.parse(JSON.stringify(req.body));
    	var events = datJson.events;
    	console.log("datJson " + events);
    	var pe = JSON.parse(events);
    	var numberOfElements = pe.length;
    	console.log("numberOfElements " + numberOfElements);
//    	// check if exist first
	    mongoose.model('Planner').remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                res.end('success');
            }
        }
    );
	    
	    
	    
//	    	  // docs is an array
//	    	  if(docs.length > 0)
//	    	  {
//	    		  
//	    	  }
//	    	});
    	
    	mongoose.model('Planner').create(pe, function (err, planner) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Blob has been created
                console.log('POST creating new planner: ' + planner);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                  html: function(){
                      // If it worked, set the header so the address bar doesn't still say /adduser
                      res.location("planner");
                      // And forward to success page
                      res.redirect("/planner");
                  },
                  //JSON response will show the newly created blob
                  json: function(){
                      res.json(planner);
                  }
              });
            }
      })
      
//    	for(var i = 0 ; i < numberOfElements ; i++)
//    	{
//    		var planner = pe[i];
//    		var title = planner.title;
//    		var start = planner.start;
//    		var end = planner.end;
//    		
//    		console.log("title " + title);
//    		console.log("start " + start);
//    		console.log("end " + end);
//    		
//            //call the create function for our database
//            mongoose.model('Planner').create({
//                title : title,
//                start : start,
//                end : end,
//                isloved : false
//            }, function (err, planner) {
//                  if (err) {
//                      res.send("There was a problem adding the information to the database.");
//                  } else {
//                      //Blob has been created
//                      console.log('POST creating new planner: ' + planner);
//                      res.format({
//                          //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
//                        html: function(){
//                            // If it worked, set the header so the address bar doesn't still say /adduser
//                            res.location("planner");
//                            // And forward to success page
//                            res.redirect("/planner");
//                        },
//                        //JSON response will show the newly created blob
//                        json: function(){
//                            res.json(planner);
//                        }
//                    });
//                  }
//            })    		
//    	}
    });

/* GET New Blob page. */
router.get('/new', function(req, res) {
    res.render('preferences/new', { title: 'Add New preferences' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Preferences').findById(id, function (err, blob) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Preferences').findById(req.id, function (err, blob) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + blob._id);
        var blobdob = blob.dob.toISOString();
        blobdob = blobdob.substring(0, blobdob.indexOf('T'))
        res.format({
          html: function(){
              res.render('preferences/show', {
                "blobdob" : blobdob,
                "blob" : blob
              });
          },
          json: function(){
              res.json(blob);
          }
        });
      }
    });
  });

router.route('/:id/edit')
	//GET the individual blob by Mongo ID
	.get(function(req, res) {
	    //search for the blob within Mongo
	    mongoose.model('Preferences').findById(req.id, function (err, blob) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the blob
	            console.log('GET Retrieving ID: ' + blob._id);
              var blobdob = blob.dob.toISOString();
              blobdob = blobdob.substring(0, blobdob.indexOf('T'))
	            res.format({
	                //HTML response will render the 'edit.jade' template
	                html: function(){
	                       res.render('preferences/edit', {
	                          title: 'Preference' + blob._id,
                            "blobdob" : blobdob,
	                          "blob" : blob
	                      });
	                 },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(blob);
	                 }
	            });
	        }
	    });
	})
	//PUT to update a blob by ID
	.put(function(req, res) {
	    // Get our REST or form values. These rely on the "name" attributes
	    var name = req.body.name;
	    var badge = req.body.badge;
	    var dob = req.body.dob;
	    var company = req.body.company;
	    var isloved = req.body.isloved;

	    //find the document by ID
	    mongoose.model('Preferences').findById(req.id, function (err, blob) {
	        //update it
	        blob.update({
	            name : name,
	            badge : badge,
	            dob : dob,
	            isloved : isloved
	        }, function (err, blobID) {
	          if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	          } 
	          else {
	                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	                  res.format({
	                      html: function(){
	                           res.redirect("/preferences/" + blob._id);
	                     },
	                     //JSON responds showing the updated values
	                    json: function(){
	                           res.json(blob);
	                     }
	                  });
	           }
	        })
	    });
	})
	//DELETE a Blob by ID
	.delete(function (req, res){
	    //find blob by ID
	    mongoose.model('Preferences').findById(req.id, function (err, blob) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            blob.remove(function (err, blob) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + blob._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/preferences");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : blob
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});

module.exports = router;