app.controller("ConfEditCtrl", function($scope, $routeParams, $location, Conf) {

	console.log('ConfEditCtrl INVOKED');

	if ($routeParams.id) {
		$scope.conf = Conf.show({ id: $routeParams.id });
	} else {
		$scope.conf = new Conf();
	}

	$scope.submit = function() {
		console.log("submit")

		function success(response) {
			console.log("success", response)
			$location.path("/conf");
		}

		function failure(response) {
			console.log("failure", response)

			_.each(response.data, function(errors, key) {
				if (errors.length > 0) {
					_.each(errors, function(e) {
						$scope.form[key].$dirty = true;
						$scope.form[key].$setValidity(e, false);
					});
				}
			});
		}

		if ($routeParams.id) {
			Conf.update($scope.conf, success, failure);
		} else {
			Conf.create($scope.conf, success, failure);
		}

	};

	$scope.cancel = function() {
		$location.path("/conf/"+$scope.conf._id);
	};

	$scope.errorClass = function(name) {
		var s = $scope.form[name];
		return s.$invalid && s.$dirty ? "error" : "";
	};

	$scope.errorMessage = function(name) {
		var s = $scope.form[name].$error;
		result = [];
		_.each(s, function(key, value) {
			result.push(value);
		});
		return result.join(", ");
	};
});