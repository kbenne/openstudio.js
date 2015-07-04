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

    drawShape: function(modelObject) {
      result = {};
      if( openstudio.model.toNode(modelObject).isNull() ) {
        result = osshapes.drawStraightComponent();
      } else {
        result = osshapes.drawNode();
      };
      return result;
    },
  
    drawStraightComponent: function() {
      shape = new createjs.Shape();
      shape.graphics.beginStroke("black").moveTo(0.0,0.0).lineTo(osshapes.standardUnit,0.0);
      return shape;
    },

    drawNode: function() {
      shape = new createjs.Shape();
      shape.graphics.beginStroke("black").moveTo(0.0,0.0).lineTo(osshapes.standardUnit,0.0);
      shape.graphics.beginFill("black").drawCircle(osshapes.standardUnit / 2.0,0,7.0);
      return shape;
    }
  };

  oscontainers = {
    drawBranch: function(modelObjects) {
      branch = new createjs.Container();
      for( oscontainers.i = 0; oscontainers.i < modelObjects.size(); ++oscontainers.i ) {
        shape = osshapes.drawShape(modelObjects.get(oscontainers.i));
        shape.x = oscontainers.i * (osshapes.standardUnit + 10.0);
        shape.y = 0.0;
        branch.addChild(shape);
      };
      return branch;
    }
  };

  openstudio.model.addSystemType7(model);
  plant = openstudio.model.getPlantLoops(model).get(0);
  supplyComps = plant.supplyComponents();

  splitter = false;
  for( i = 0; i != supplyComps.size(); ++i ) {
    option = openstudio.model.toSplitter(supplyComps.get(i));
    if( ! option.isNull() ) splitter = option.get();
  };

  mixer = false;
  for( i = 0; i != supplyComps.size(); ++i ) {
    option = openstudio.model.toMixer(supplyComps.get(i))
    if( ! option.isNull() ) mixer = option.get();
  };

  stage = new createjs.Stage("demoCanvas");

  xpos = 0.0;

  if( splitter && mixer ) {
    outletObjects = splitter.outletModelObjects();
    inletObjects = mixer.inletModelObjects();

    xpos = xpos + osshapes.standardUnit;

    for( i = 0; i < inletObjects.size(); ++i ) {
      branchComps = plant.supplyComponents(openstudio.model.toHVACComponent(outletObjects.get(i)).get(),openstudio.model.toHVACComponent(inletObjects.get(i)).get());
      branch = oscontainers.drawBranch(branchComps);
      branch.x = xpos;
      branch.y = (i + 1) * (osshapes.standardUnit + 10.0);
      stage.addChild(branch);
    };
  };


  //for( i = 0; i < supplyComps.size(); ++i ) {
  //  shape = osshapes.drawShape(supplyComps.get(i));
  //  shape.x = i * (osshapes.standardUnit + 10.0);
  //  shape.y = 50.0;
  //  stage.addChild(shape);
  //};

  stage.update();
};
openstudioApp.controller('systemsController', systemsController);

