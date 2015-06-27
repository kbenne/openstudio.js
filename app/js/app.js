var openstudioApp = angular.module('openstudioApp', ['ngRoute']);

var openstudio = require('../openstudio-node/OpenStudio.js').openstudio;
var model = new openstudio.model.Model();

openstudioApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/zones', {
        templateUrl: 'partials/zones.html',
      }).
      when('/systems', {
        templateUrl: 'partials/systems.html',
      }).
      otherwise({
        redirectTo: '/zones'
      });
  }]);

