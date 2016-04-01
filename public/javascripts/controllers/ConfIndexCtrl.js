app.controller('ConfIndexCtrl', function($scope, $location, Conf) {
	
	console.log('ConfIndexCtrl INVOKED');
	
	$scope.new = function() {
		console.log('new() invoked');
		$location.path("/conf/new");
	};
	
	$scope.confs = Conf.index();
	console.log('$scope.confs <' + $scope.confs+ '>');

});