'use strict';

openstudioApp.factory('os', [function () {
  var service = {};

  service.openstudio = require('../openstudio-node/OpenStudio.js').openstudio;
  service.model = new service.openstudio.model.Model();

  return service;
}]);
