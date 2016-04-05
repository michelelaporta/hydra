'use strict';

var app = angular.module('myApp', ['ngRoute','ngResource','toggle-switch']);
//var app = angular.module('myApp', ['ngRoute','ngResource','ui.bootstrap','toggle-switch']);

app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
	//console.log('config invoked');
//	$locationProvider.html5Mode(true);
	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});	
    $routeProvider
      //.when("/index", { templateUrl: "index" })
      .when("/index", { templateUrl: "index/partials/index.jade", controller: "IndexCtrl",resolve: {
          // I will cause a 1 second delay
          delay: function($q, $timeout) {
            var delay = $q.defer();
            $timeout(delay.resolve, 1000);
            return delay.promise;
          }}})
      .when("/conf", { templateUrl: "conf/partials/index.jade", controller: "ConfIndexCtrl" })
      .when("/conf/new", { templateUrl: "conf/partials/edit.jade", controller: "ConfEditCtrl" })
      .when("/conf/:id", { templateUrl: "conf/partials/show.jade", controller: "ConfShowCtrl" })
      .when("/conf/:id/edit", { templateUrl: "conf/partials/edit.jade", controller: "ConfEditCtrl" })
      //.when("/conf/:id/remove", { templateUrl: "conf/partials/show.jade", controller: "ConfIndexCtrl" })
      .otherwise({ redirectTo: "/conf" });
    
}]);

