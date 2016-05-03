'use strict';

/* Directives */


angular.module('myApp.directives', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('hello', function() {
    return {
        restrict: 'E',
        template: '<p>C o n f i g u r a t i o n</p>'
    };
  });

