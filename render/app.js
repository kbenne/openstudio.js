'use strict';

var openstudioApp = angular.module('openstudioApp', [
  'ngAnimate',
  'ui.router', 'ui.router.stateHelper',
  'ui.bootstrap',
  'angularSpinner']);

openstudioApp.config(['$logProvider', '$urlRouterProvider', 'stateHelperProvider', 'usSpinnerConfigProvider', function ($logProvider, $urlRouterProvider, stateHelperProvider, usSpinnerConfigProvider) {
  usSpinnerConfigProvider.setDefaults({
    color: '#70be44',
    lines: 13,
    length: 0,
    width: 22,
    radius: 60,
    speed: 2.2,
    trail: 60,
    shadow: false,
    hwaccel: true
  });

  $urlRouterProvider.when('', '/zones').otherwise('/zones');

  stateHelperProvider
    .state({
      name: 'zones',
      url: '/zones',
      controller: 'ZonesCtrl',
      templateUrl: 'partials/zones.html'
    })
    .state({
      name: 'systems',
      url: '/systems',
      controller: 'SystemsCtrl',
      templateUrl: 'partials/systems.html'
    });
}]);

openstudioApp.run(['$rootScope', '$log', 'Shared', function ($rootScope, $log, Shared) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //$log.debug('Changing state', toState);
    Shared.startSpinner();
  });
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    //$log.debug('State change success');
    Shared.stopSpinner();
  });
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    $log.error('Unhandled state change error:', error);
    Shared.stopSpinner();
  });
  $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
    $log.error('State not found:', unfoundState.to);
  });
}]);

// For debugging, call bootlint()
var bootlint = (function(){var s=document.createElement("script");s.onload=function(){bootlint.showLintReportForCurrentDocument([]);};s.src="https://maxcdn.bootstrapcdn.com/bootlint/latest/bootlint.min.js";document.body.appendChild(s)});
