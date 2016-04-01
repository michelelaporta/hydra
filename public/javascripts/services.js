'use strict';

//var services = angular.module('myApp.services', ['ngResource']);

app.factory("Conf", function($resource, $http) {
	console.log('Service Conf INVOKED');
  var resource = $resource("/api/conf/:id", { id: "@_id" },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );
	//console.log('Service Conf resource ' + resource);
  
  return resource;
});
