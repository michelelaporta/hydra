app.controller('IndexCtrl', function($scope, $routeParams, $location, Conf,socket) {
	
	$scope.confs = Conf.index();
	
	$scope.switchChannel = function (conf){
	 console.log('channel  ' + conf.name + ' enable ' + conf.enable );
	 //$scope.conf.enable = confEnable;
	 socket.emit('channel',conf);
	};
	
});