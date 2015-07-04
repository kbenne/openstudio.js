'use strict';

openstudioApp.factory('Shared', ['$log', 'usSpinnerService', function ($log, usSpinnerService) {
  var service = {};

  service.startSpinner = function () {
    usSpinnerService.spin('spinner');
  };

  service.stopSpinner = function () {
    usSpinnerService.stop('spinner');
  };

  return service;
}]);
