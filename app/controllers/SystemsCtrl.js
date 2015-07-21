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
      shape.graphics.beginStroke("black").moveTo(0.0,0.0).lineTo(osshapes.standardUnit / 2.0 - 7.0,0.0);
      shape.graphics.beginStroke("black").drawCircle(osshapes.standardUnit / 2.0,0,7.0);
      shape.graphics.beginStroke("black").moveTo(osshapes.standardUnit / 2.0 + 7.0,0.0).lineTo(osshapes.standardUnit,0.0);
      return shape;
    },

    drawSplitter: function(branchLengths) {
      var shape = new createjs.Shape();
      shape.graphics.beginStroke("black").moveTo(osshapes.standardUnit / 2.0,0.0).lineTo(osshapes.standardUnit / 2.0,osshapes.standardUnit * branchLengths);
      for( var i = 0; i < branchLengths; ++i ) {
        shape.graphics.beginStroke("black").moveTo(osshapes.standardUnit / 2.0,osshapes.standardUnit * i).lineTo(osshapes.standardUnit,osshapes.standardUnit * i);
      };
      return shape;
    },

    drawMixer: function(branchLengths) {
      var shape = new createjs.Shape();
      shape.graphics.beginStroke("black").moveTo(osshapes.standardUnit / 2.0,0.0).lineTo(osshapes.standardUnit / 2.0,osshapes.standardUnit * branchLengths);
      for( var i = 0; i < branchLengths; ++i ) {
        shape.graphics.beginStroke("black").moveTo(0.0,osshapes.standardUnit * i).lineTo(osshapes.standardUnit / 2.0,osshapes.standardUnit * i);
      };
      return shape;
    },

    drawDropZone: function() {
      var offset = 15;
      var shape = new createjs.Shape();
      shape.graphics.beginStroke("black").drawRoundRect(0.0,offset - osshapes.standardUnit / 2.0,osshapes.standardUnit * 2,osshapes.standardUnit - offset * 2,5.0);
      shape.setBounds(0.0,offset - osshapes.standardUnit / 2.0,osshapes.standardUnit * 2,osshapes.standardUnit - offset * 2);
      return shape;
    }
  };

  var oscontainers = {
    drawBranch: function(modelObjects) {
      var branch = new createjs.Container();
      for( var i = 0; i < modelObjects.size(); ++i ) {
        var shape = osshapes.drawShape(modelObjects.get(i));
        shape.x = i * osshapes.standardUnit;
        shape.y = 0.0;
        branch.addChild(shape);
      };
      return branch;
    }
  };

  const plant = os.openstudio.model.getPlantLoops(os.model).get(0);
  const supplyComps = plant.supplyComponents();

  var splitterModelObject = false;
  for( var i = 0; i != supplyComps.size(); ++i ) {
    const option = os.openstudio.model.toSplitter(supplyComps.get(i));
    if( ! option.isNull() ) splitterModelObject = option.get();
  };

  var mixerModelObject = false;
  for( var i = 0; i != supplyComps.size(); ++i ) {
    const option = os.openstudio.model.toMixer(supplyComps.get(i))
    if( ! option.isNull() ) mixerModelObject = option.get();
  };

  var stage = new createjs.Stage("demoCanvas");

  var xpos = osshapes.standardUnit;
  var ypos = 0.5 + (osshapes.standardUnit);

  if( splitterModelObject && mixerModelObject ) {
    var outletObjects = splitterModelObject.outletModelObjects();
    var inletObjects = mixerModelObject.inletModelObjects();

    var splitter = osshapes.drawSplitter(outletObjects.size());
    splitter.x = xpos;
    splitter.y = ypos;
    stage.addChild(splitter);

    var branches = new Array;
    var longestBranchLength = 0;
    for( var i = 0; i < inletObjects.size(); ++i ) {
      var branchComps = plant.supplyComponents(os.openstudio.model.toHVACComponent(outletObjects.get(i)).get(),os.openstudio.model.toHVACComponent(inletObjects.get(i)).get());
      if( branchComps.size() > longestBranchLength ) { longestBranchLength = branchComps.size(); }
      branches[i] = oscontainers.drawBranch(branchComps);
    };

    xpos = xpos + osshapes.standardUnit;

    for( var i = 0; i < inletObjects.size(); ++i ) {
      var branch = branches[i];
      branch.x = xpos;
      branch.y = ypos + i * osshapes.standardUnit;
      stage.addChild(branch);
    };

    var dropZone = osshapes.drawDropZone();
    dropZone.x = xpos + (longestBranchLength / 2.0 * osshapes.standardUnit) - (dropZone.getBounds().width / 2.0);
    dropZone.y = ypos + inletObjects.size() * osshapes.standardUnit;
    stage.addChild(dropZone);

    xpos = xpos + (longestBranchLength * osshapes.standardUnit);

    var mixer = osshapes.drawMixer(outletObjects.size());
    mixer.x = xpos;
    mixer.y = ypos;
    stage.addChild(mixer);
  };

  stage.update();
}]);
