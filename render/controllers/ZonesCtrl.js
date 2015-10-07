'use strict';

openstudioApp.controller('ZonesCtrl', ['$scope', '$log', 'os', function ($scope, $log, os) {
  $scope.zones = [];

  function Zone(os_zone) {
    this.model_object = os_zone;
    Object.defineProperties(this, {
      name: {
        get: function () {
          return this.model_object.name().get();
        },
        set: function (_name) {
          this.model_object.setName(_name);
        }
      },
      multiplier: {
        get: function () {
          return this.model_object.multiplier();
        },
        set: function (_value) {
          if (Number.isInteger(_value)) this.model_object.setMultiplier(_value);
        }
      }
    });
  }

  var os_zones = os.openstudio.model.getThermalZones(os.model);
  for (var i = 0; i < os_zones.size(); ++i) {
    var _zone = new Zone(os_zones.get(i));
    $scope.zones.push(_zone);
  }

  $scope.addZone = function () {
    var _zone = new Zone(new os.openstudio.model.ThermalZone(os.model));
    $scope.zones.push(_zone);
  };

  $scope.removeZone = function (_zone) {
    $scope.zones.splice($scope.zones.indexOf(_zone), 1);
    _zone.model_object.remove();
  };
}]);
