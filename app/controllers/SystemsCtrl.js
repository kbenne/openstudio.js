'use strict';

openstudioApp.controller('SystemsCtrl', ['$scope', '$log', 'os', function ($scope, $log, os) {

  var osshapes = {
    standardUnit: 100.0,

    drawShape: function(modelObject) {
      var result = {};
      if( os.openstudio.model.toNode(modelObject).isNull() ) {
        result = osshapes.drawStraightComponent();
      } else {
        result = osshapes.drawNode();
      };
      return result;
    },
  
    drawStraightComponent: function() {
      var shape = new createjs.Shape();
      shape.graphics.beginStroke("black").moveTo(0.0,0.0).lineTo(osshapes.standardUnit,0.0);
      return shape;
    },

    drawNode: function() {
      var shape = new createjs.Shape();
      shape.graphics.beginStroke("black").moveTo(0.0,0.0).lineTo(osshapes.standardUnit,0.0);
      shape.graphics.beginFill("black").drawCircle(osshapes.standardUnit / 2.0,0,7.0);
      return shape;
    }
  };

  var oscontainers = {
    drawBranch: function(modelObjects) {
      var branch = new createjs.Container();
      for( oscontainers.i = 0; oscontainers.i < modelObjects.size(); ++oscontainers.i ) {
        var shape = osshapes.drawShape(modelObjects.get(oscontainers.i));
        shape.x = oscontainers.i * (osshapes.standardUnit + 10.0);
        shape.y = 0.0;
        branch.addChild(shape);
      };
      return branch;
    }
  };

  os.openstudio.model.addSystemType7(os.model);
  const plant = os.openstudio.model.getPlantLoops(os.model).get(0);
  const supplyComps = plant.supplyComponents();

  var splitter = false;
  for( var i = 0; i != supplyComps.size(); ++i ) {
    const option = os.openstudio.model.toSplitter(supplyComps.get(i));
    if( ! option.isNull() ) splitter = option.get();
  };

  var mixer = false;
  for( var i = 0; i != supplyComps.size(); ++i ) {
    const option = os.openstudio.model.toMixer(supplyComps.get(i))
    if( ! option.isNull() ) mixer = option.get();
  };

  var stage = new createjs.Stage("demoCanvas");

  var xpos = 0.0;

  if( splitter && mixer ) {
    const outletObjects = splitter.outletModelObjects();
    const inletObjects = mixer.inletModelObjects();

    xpos = xpos + osshapes.standardUnit;

    for( var i = 0; i < inletObjects.size(); ++i ) {
      const branchComps = plant.supplyComponents(os.openstudio.model.toHVACComponent(outletObjects.get(i)).get(),os.openstudio.model.toHVACComponent(inletObjects.get(i)).get());
      var branch = oscontainers.drawBranch(branchComps);
      branch.x = xpos;
      branch.y = (i + 1) * (osshapes.standardUnit + 10.0);
      stage.addChild(branch);
    };
  };

  stage.update();
}]);
