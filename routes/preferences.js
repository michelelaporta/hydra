var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

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

//build the REST operations at the base for preferences
//this will be accessible from https://127.0.0.1:4443/preferences if the default route for / is left unchanged
router.route('/')
    //GET all preferences
    .get(function(req, res, next) {
        //retrieve all preferences from Monogo
        mongoose.model('Preferences').find({}, function (err, preferences) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                    html: function(){
                        res.render('preferences/index', {
                              title: 'All my preferences',
                              "preferences" : preferences
                          });
                    },
                    //JSON response will show all preferences in JSON format
                    json: function(){
                        res.json(preferences);
                    }
                });
              }     
        });
    })
    //POST a new preferences
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var badge = req.body.badge;
        var dob = req.body.dob;
        var company = req.body.company;
        var isloved = req.body.isloved;
        //call the create function for our database
        mongoose.model('Preferences').create({
            name : name,
            badge : badge,
            dob : dob,
            isloved : isloved
        }, function (err, preferences) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //preferences has been created
                  console.log('POST creating new preferences: ' + preferences);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("preferences");
                        // And forward to success page
                        res.redirect("/preferences");
                    },
                    //JSON response will show the newly created preferences
                    json: function(){
                        res.json(preferences);
                    }
                });
              }
        });
    });

/* GET New preferences page. */
router.get('/new', function(req, res) {
    res.render('preferences/new', { title: 'Add New preferences' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Preferences').findById(id, function (err, preferences) {
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
            //console.log(preferences);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
	console.log('req.id ' + req.id);
    mongoose.model('Preferences').findById(req.id, function (err, preferences) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + preferences._id);
        var preferencesDob = preferences.dob.toISOString();
        preferencesDob = preferencesDob.substring(0, preferencesDob.indexOf('T'))
        console.log('preferencesDob: ' + preferencesDob);
        
        res.format({
          html: function(){
              res.render('preferences/show', {
                "preferencesDob" : preferencesDob,
                "preferences" : preferences
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
	//GET the individual preferences by Mongo ID
	.get(function(req, res) {
	    //search for the blob within Mongo
	    mongoose.model('Preferences').findById(req.id, function (err, preferences) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the blob
	            console.log('GET Retrieving ID: ' + preferences._id);
              var preferencesDob = preferences.dob.toISOString();
              preferencesDob = preferencesDob.substring(0, preferencesDob.indexOf('T'))
	            res.format({
	                //HTML response will render the 'edit.jade' template
	                html: function(){
	                       res.render('preferences/edit', {
	                          title: 'Preference' + preferences._id,
                            "preferencesDob" : preferencesDob,
	                          "preferences" : preferences
	                      });
	                 },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(preferences);
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
	    mongoose.model('Preferences').findById(req.id, function (err, preferences) {
	        //update it
	    	preferences.update({
	            name : name,
	            badge : badge,
	            dob : dob,
	            isloved : isloved
	        }, function (err, preferencesID) {
	          if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	          } 
	          else {
	                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	                  res.format({
	                      html: function(){
	                           res.redirect("/preferences/" + preferences._id);
	                     },
	                     //JSON responds showing the updated values
	                    json: function(){
	                           res.json(preferences);
	                     }
	                  });
	           }
	        })
	    });
	})
	//DELETE a Blob by ID
	.delete(function (req, res){
	    //find blob by ID
	    mongoose.model('Preferences').findById(req.id, function (err, preferences) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	        	preferences.remove(function (err, preferences) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing preferences ID: ' + preferences._id);
	                    res.format({ 
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/preferences");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : preferences
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});

module.exports = router;