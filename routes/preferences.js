
// module constructor function
module.exports = function(req,res,next) {
   //console.log(options);
   return {
       list: function(req, res, next) {
    	   var mailV = 'aaa@bbb.it';
    	   console.log('mailV '+ mailV + " next " + next);
           // can access options.key here
           // something here
    	   res.render('preferences', { title: 'Preferences Hydra',mail:mailV})
       }
   };
}
