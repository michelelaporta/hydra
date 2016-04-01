// `main.js` is the file that sbt-web will use as an entry point
(function (requirejs) {
  'use strict';

  // -- RequireJS config --
  requirejs.config({
    // Packages = top-level folders; loads a contained file named 'main.js"
    packages: ['common', 'home','user','users','dashboard','stats','targets','map','maps','probes','fleet'],
    shim: {
      'jsRoutes': {
        deps: [],
        // it's not a RequireJS module, so we have to tell it what var is returned
        exports: 'jsRoutes'
      },
      // Hopefully this all will not be necessary but can be fetched from WebJars in the future
      'angular': {
        deps: ['jquery'],
        exports: 'angular'
      },
      'openLayers': {
          exports: 'OpenLayers'
      },
      'highcharts': {
          exports: 'Highcharts'
      },
      'rickshaw': {
          exports: 'Rickshaw'
      },
      'd3': {
          exports: 'd3'
      },
      'angular-route': ['angular'],
      'angular-cookies': ['angular'],
      'bootstrap': ['jquery'],
      'app': {deps: ['requirejs', 'jquery','angular', 'angular-route', 'angular-cookies', 'bootstrap','jsRoutes','domReady','openLayers','leaflet','highcharts','rickshaw','d3']}
    },
    paths: {
      'requirejs': ['../lib/requirejs/require'],
      'jquery': ['../lib/jquery/jquery'],
      'angular': ['../lib/angularjs/angular'],
      'angular-route': ['../lib/angularjs/angular-route'],
      'angular-cookies': ['../lib/angularjs/angular-cookies'],
      'bootstrap': ['../lib/bootstrap/js/bootstrap'],
      'jsRoutes': ['/jsroutes'],
      "domReady": ["../lib/requirejs-domready/domReady"],
      'openLayers': ['//openlayers.org/api/OpenLayers'],
      "leaflet": "//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet",
      "highcharts": "../lib/highcharts/highcharts",
      "rickshaw": "../lib/rickshaw/rickshaw",
      "d3": "../lib/d3js/d3"
    },
    waitSeconds: 200,
    deps: ['jquery',
           'angular',
           'angular-route',
           'angular-cookies',
           'bootstrap',
           'app',
           'domReady',
           'openLayers',
           'highcharts',
           'rickshaw',
           'd3'
       ],
       callback: function() {
           require(['bootstrap']);
       }
  });

  requirejs.onError = function (err) {
    console.log(err);
  };
  
  require(['leaflet'], function(leaflet) {
    console.log('leaflet->'+L.version);
	//console.log(L);
  });
  
  require(['openLayers'], function(openLayers) {
    console.log('openLayers->'+openLayers.VERSION_NUMBER);
	console.log(L);
  });
  
})(requirejs);
