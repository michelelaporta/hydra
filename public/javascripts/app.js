'use strict';

//init app module and declare it's dependencies on other modules
//declare top-level module which depends on filters,and services
var app = angular.module('myApp', ['myApp.directives','ngRoute','ngResource','toggle-switch']);


var filters = angular.module('myApp.filters', []);
var directives = angular.module('myApp.directives', []);


app.config(['$routeProvider','$locationProvider','$httpProvider', function($routeProvider,$locationProvider,$httpProvider) {
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

//this is run after angular is instantiated and bootstrapped
//app.run(function ($rootScope, $location, $http, $timeout, AuthService, RESTService) {
//	// *****
//    // Eager load some data using simple REST client
//    // *****
//
//    $rootScope.restService = RESTService;
//
//    // async load constants
//    $rootScope.constants = [];
//    $rootScope.restService.get('data/constants.json', function (data) {
//            $rootScope.constants = data[0];
//        }
//    );
//
//    // async load data do be used in table (playgound grid widget)
//    $rootScope.listData = [];
//    $rootScope.restService.get('data/generic-list.json', function (data) {
//            $rootScope.listData = data;
//        }
//    );
//
//    // *****
//    // Initialize authentication
//    // *****
//    $rootScope.authService = AuthService;
//
//    // text input for login/password (only)
//    $rootScope.loginInput = 'user@gmail.com';
//    $rootScope.passwordInput = 'complexpassword';
//
//    $rootScope.$watch('authService.authorized()', function () {
//
//        // if never logged in, do nothing (otherwise bookmarks fail)
//        if ($rootScope.authService.initialState()) {
//            // we are public browsing
//            return;
//        }
//
//        // instantiate and initialize an auth notification manager
//        $rootScope.authNotifier = new NotificationManager($rootScope);
//
//        // when user logs in, redirect to home
//        if ($rootScope.authService.authorized()) {
//            $location.path("/");
//            $rootScope.authNotifier.notify('information', 'Welcome ' + $rootScope.authService.currentUser() + "!");
//        }
//
//        // when user logs out, redirect to home
//        if (!$rootScope.authService.authorized()) {
//            $location.path("/");
//            $rootScope.authNotifier.notify('information', 'Thanks for visiting.  You have been signed out.');
//        }
//
//    }, true);
//
//    // TODO move this out to a more appropriate place
//    $rootScope.faq = [
//        {key: "What is Angular-Enterprise-Seed?", value: "A starting point for server-agnostic, REST based or static/mashup UI."},
//        {key: "What are the pre-requisites for running the seed?", value: "Just an HTTP server.  Add your own backend."},
//        {key: "How do I change styling (css)?", value:  "Change Bootstrap LESS and rebuild with the build.sh script.  This will update the appropriate css/image/font files."}
//    ];
//}



