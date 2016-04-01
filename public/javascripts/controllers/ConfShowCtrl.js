app.controller("ConfShowCtrl", function($scope, $routeParams, Conf) {
	
	console.log('ConfShowCtrl INVOKED');

	$scope.conf = Conf.show({ id: $routeParams.id });
});