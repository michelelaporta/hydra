app.controller("ConfShowCtrl", function($scope, $routeParams, Conf) {
	
	console.log('ConfShowCtrl INVOKED id '  +$routeParams.id );

	if ($routeParams.id) {
		$scope.conf = Conf.show({ id: $routeParams.id });
	} 
});