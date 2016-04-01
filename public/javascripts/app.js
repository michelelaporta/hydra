'use strict';

// Declare app level module which depends on filters, and services
//var app = angular.module('myApp', ['myApp.filters','myApp.services', 'myApp.directives','ngRoute','ngResource']);
var app = angular.module('myApp', ['ngRoute','ngResource']);

app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
	console.log('config invoked');
//	$locationProvider.html5Mode(true);
	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});	
    $routeProvider
      //.when("/index", { templateUrl: "index" })
      .when("/conf", { templateUrl: "conf/partials/index.jade", controller: "ConfIndexCtrl" })
      .when("/conf/new", { templateUrl: "conf/partials/edit.jade", controller: "ConfEditCtrl" })
      .when("/conf/:id", { templateUrl: "conf/partials/show.jade", controller: "ConfShowCtrl" })
      .when("/conf/:id/edit", { templateUrl: "conf/partials/edit.jade", controller: "ConfEditCtrl" })
      .otherwise({ redirectTo: "/conf" });
    
}]);

