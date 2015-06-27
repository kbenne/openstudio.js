var zonesController = function ($scope) {
  function zone(os_zone) {
    this.model_object = os_zone;
    Object.defineProperties(this, {
      name: {
        get: function() {
          return this.model_object.name().get();
        },
        set: function(_name) {
          this.model_object.setName(_name);
        }
      },
      multiplier: {
        get: function() {
          return this.model_object.multiplier();
        },
        set: function(_value) {
          if (Number.isInteger(_value)) this.model_object.setMultiplier(_value);
        }
      }
    });
  };

  $scope.zones = [];
  os_zones = openstudio.model.getThermalZones(model);
  for( i = 0; i < os_zones.size();  i++ ) {
    _zone = new zone(os_zones.get(i));
    $scope.zones.push(_zone);
  };

  $scope.addZone = function () {
    _zone = new zone(new openstudio.model.ThermalZone(model));
    $scope.zones.push(_zone);
  };

  $scope.removeZone = function (_zone) {
    $scope.zones.splice($scope.zones.indexOf(_zone),1);
    _zone.model_object.remove();
  };
};
openstudioApp.controller('zonesController', zonesController);
