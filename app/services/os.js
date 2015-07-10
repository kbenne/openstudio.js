'use strict';

openstudioApp.factory('os', [function () {
  var service = {};

  service.openstudio = require('../openstudio-node/OpenStudio.js').openstudio;
  service.model = new service.openstudio.model.Model();
  service.openstudio.model.addSystemType7(service.model);

  return service;
}]);
