app.controller('ConfIndexCtrl', function($scope, $routeParams, $location, Conf) {
	
	console.log('ConfIndexCtrl INVOKED ');
	
	$scope.new = function() {
		console.log('new() invoked');
		$location.path("/conf/new");
	};

	$scope.delete = function(conf) {
		
		console.log('delete() invoked ' + conf);
		
		Conf.destroy({ _id: conf}, function(err,conf) {
			//res.json(true);
			if (err)
	            res.send(err);
	
	        // get and return all the conf after you remove one
			Conf.find(function(err, confs) {
	            if (err)
	                res.send(err)
	            res.json(confs);
	        });			
		});		
	};

	$scope.confs = Conf.index();
	console.log('$scope.confs <' + $scope.confs+ '>');

});