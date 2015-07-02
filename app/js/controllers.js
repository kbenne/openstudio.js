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

var systemsController = function ($scope) {

  osshapes = {
    standardUnit: 100.0,

    getShape: function(modelObject) {
      result = {};
      if( openstudio.model.toNode(modelObject).isNull() ) {
        result = new osshapes.StraightComponent();
      } else {
        result = new osshapes.Node();
      };
      return result;
    },
  
    StraightComponent: function() {
      shape = new createjs.Shape();
      shape.graphics.beginStroke("black").moveTo(0.0,0.0).lineTo(osshapes.standardUnit,0.0);
      return shape;
    },

    Node: function() {
      shape = new createjs.Shape();
      shape.graphics.beginStroke("black").moveTo(0.0,0.0).lineTo(osshapes.standardUnit,0.0);
      shape.graphics.beginFill("black").drawCircle(osshapes.standardUnit / 2.0,0,7.0);
      return shape;
    }
  };

  openstudio.model.addSystemType7(model);
  plant = openstudio.model.getPlantLoops(model).get(0);
  supplyComps = plant.supplyComponents();

  stage = new createjs.Stage("demoCanvas");

  for( i = 0; i < supplyComps.size(); ++i ) {
    shape = osshapes.getShape(supplyComps.get(i));
    shape.x = i * (osshapes.standardUnit + 10.0);
    shape.y = 50.0;
    stage.addChild(shape);
  };

  stage.update();
};
openstudioApp.controller('systemsController', systemsController);

