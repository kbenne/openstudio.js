'use strict';

openstudioApp.controller('SystemsCtrl', ['$scope', '$log', 'os', function ($scope, $log, os) {

  var osshapes = {
    standardUnit: 100.0,
    margin: 15,

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
      var container = new createjs.Container();
      var shape = new createjs.Shape();
      container.setBounds(0.0,0.0,osshapes.standardUnit,osshapes.standardUnit);
      container.addChild(shape);
      var boundingRect = container.getBounds();
      var midY = boundingRect.height / 2.0;
      shape.graphics.beginStroke("black").moveTo(0.0,midY).lineTo(osshapes.standardUnit,midY);

      var bitmap = new createjs.Bitmap("images/pipe.png");
      bitmap.x = 0.0;
      bitmap.y = 0.0;
      bitmap.image.onload = function() { stage.update(); };
      container.addChild(bitmap);

      return container;
    },

    drawNode: function() {
      var shape = new createjs.Shape();
      shape.setBounds(0.0,0.0,osshapes.standardUnit,osshapes.standardUnit);
      var boundingRect = shape.getBounds();
      var midY = boundingRect.height / 2.0;
      shape.graphics.beginStroke("black").moveTo(0.0,midY).lineTo(osshapes.standardUnit / 2.0 - 7.0,midY);
      shape.graphics.beginStroke("black").drawCircle(osshapes.standardUnit / 2.0,midY,7.0);
      shape.graphics.beginStroke("black").moveTo(osshapes.standardUnit / 2.0 + 7.0,midY).lineTo(osshapes.standardUnit,midY);
      return shape;
    },

    drawSplitter: function(branchLengths) {
      var shape = new createjs.Shape();
      shape.setBounds(0.0,0.0,osshapes.standardUnit,osshapes.standardUnit * (branchLengths + 1));
      var boundingRect = shape.getBounds();
      var yStart = osshapes.standardUnit / 2.0;
      var xStart = osshapes.standardUnit / 2.0;
      shape.graphics.beginStroke("black").moveTo(xStart,yStart).lineTo(xStart,yStart + osshapes.standardUnit * branchLengths);
      for( var i = 0; i <= branchLengths; ++i ) {
        var branchY = osshapes.standardUnit / 2.0 + osshapes.standardUnit * i;
        shape.graphics.beginStroke("black").moveTo(xStart,branchY).lineTo(osshapes.standardUnit,branchY);
      };
      var midpoint = yStart + branchLengths * osshapes.standardUnit / 2.0;
      shape.graphics.beginStroke("black").moveTo(0.0,midpoint).lineTo(xStart,midpoint);
      return shape;
    },

    drawMixer: function(branchLengths) {
      var shape = new createjs.Shape();
      shape.setBounds(0.0,0.0,osshapes.standardUnit,osshapes.standardUnit * (branchLengths + 1));
      var boundingRect = shape.getBounds();
      var yStart = osshapes.standardUnit / 2.0;
      var xStart = osshapes.standardUnit / 2.0;
      shape.graphics.beginStroke("black").moveTo(xStart,yStart).lineTo(xStart,yStart + osshapes.standardUnit * branchLengths);
      for( var i = 0; i <= branchLengths; ++i ) {
        shape.graphics.beginStroke("black").moveTo(0.0,yStart + osshapes.standardUnit * i).lineTo(xStart,yStart + osshapes.standardUnit * i);
      };
      var midpoint = yStart + branchLengths * osshapes.standardUnit / 2.0;
      shape.graphics.beginStroke("black").moveTo(xStart,midpoint).lineTo(osshapes.standardUnit,midpoint);
      return shape;
    },

    drawDropZone: function() {
      var shape = new createjs.Shape();
      shape.setBounds(0.0,0.0,osshapes.standardUnit * 2.0,osshapes.standardUnit);
      var boundingRect = shape.getBounds();
      shape.graphics.beginStroke("black").drawRoundRect(0.0,osshapes.margin,boundingRect.width,boundingRect.height - osshapes.margin * 2.0,5.0);
      return shape;
    },

    drawBranch: function(modelObjects) {
      var width = 0.0;
      var height = 0.0;
      var branch = new createjs.Container();
      for( var i = 0; i < modelObjects.size(); ++i ) {
        var shape = osshapes.drawShape(modelObjects.get(i));
        shape.x = width;
        shape.y = 0.0;
        branch.addChild(shape);
        var bounds = shape.getBounds();
        width = width + bounds.width;
        if( height < bounds.height ) {
          height = bounds.height;
        }
      };

      branch.setBounds(0.0,0.0,width,height);
      return branch;
    },

    drawSplitterMixerSet: function(splitterModelObject,mixerModelObject) {
      var splitterMixerSet = new createjs.Container();

      var outletObjects = splitterModelObject.outletModelObjects();
      var inletObjects = mixerModelObject.inletModelObjects();
      var xpos = 0.0;
      var ypos = 0.0;

      var splitter = osshapes.drawSplitter(outletObjects.size());
      splitter.x = xpos;
      splitter.y = ypos;
      splitterMixerSet.addChild(splitter);

      var branches = new Array;
      var longestBranchLength = 0;
      for( var i = 0; i < inletObjects.size(); ++i ) {
        var branchComps = plant.supplyComponents(os.openstudio.model.toHVACComponent(outletObjects.get(i)).get(),os.openstudio.model.toHVACComponent(inletObjects.get(i)).get());
        if( branchComps.size() > longestBranchLength ) { longestBranchLength = branchComps.size(); }
        branches[i] = osshapes.drawBranch(branchComps);
      };

      xpos = xpos + osshapes.standardUnit;

      for( var i = 0; i < inletObjects.size(); ++i ) {
        var branch = branches[i];
        branch.x = xpos;
        branch.y = ypos + i * osshapes.standardUnit;
        splitterMixerSet.addChild(branch);
      };

      var dropZone = osshapes.drawDropZone();
      var halfDiff = (longestBranchLength * osshapes.standardUnit - dropZone.getBounds().width) / 2.0;
      dropZone.x = xpos + halfDiff;
      dropZone.y = ypos + inletObjects.size() * osshapes.standardUnit;
      splitterMixerSet.addChild(dropZone);

      var dropZoneInlet = new createjs.Shape();
      dropZoneInlet.graphics.beginStroke("black").moveTo(0.0,0.0).lineTo(halfDiff,0.0);
      dropZoneInlet.x = xpos;
      dropZoneInlet.y = dropZone.y + dropZone.getBounds().height / 2.0;
      splitterMixerSet.addChild(dropZoneInlet);

      var dropZoneOutlet = new createjs.Shape();
      dropZoneOutlet.graphics.beginStroke("black").moveTo(0.0,0.0).lineTo(halfDiff,0.0);
      dropZoneOutlet.x = dropZone.x + dropZone.getBounds().width;
      dropZoneOutlet.y = dropZone.y + dropZone.getBounds().height / 2.0;
      splitterMixerSet.addChild(dropZoneOutlet);

      xpos = xpos + (longestBranchLength * osshapes.standardUnit);

      var mixer = osshapes.drawMixer(outletObjects.size());
      mixer.x = xpos;
      mixer.y = ypos;
      splitterMixerSet.addChild(mixer);

      splitterMixerSet.setBounds(0.0,0.0,osshapes.standardUnit * (longestBranchLength + 2),osshapes.standardUnit * inletObjects.size());

      return splitterMixerSet;
    },

    drawSupplySide: function(loop) {
      const supplyComps = loop.supplyComponents();

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

      var supplyInletBranch = false;
      var supplyOutletBranch = false;
      var splitterMixerSet = false;

      if( splitterModelObject ) {
        var supplyInletComponents = loop.supplyComponents(loop.supplyInletNode(),os.openstudio.model.toHVACComponent(splitterModelObject.inletModelObject().get()).get());
        supplyInletBranch = osshapes.drawBranch(supplyInletComponents);
      };

      if( splitterModelObject && mixerModelObject ) {
        splitterMixerSet = osshapes.drawSplitterMixerSet(splitterModelObject,mixerModelObject);
      };

      if( mixerModelObject ) {
        var supplyOutletComponents = loop.supplyComponents(os.openstudio.model.toHVACComponent(mixerModelObject.outletModelObject().get()).get(),loop.supplyOutletNode());
        supplyOutletBranch = osshapes.drawBranch(supplyOutletComponents); 
      }

      var xpos = osshapes.margin;
      var ypos = 0.5 + osshapes.margin;

      if( supplyInletBranch ) {
        supplyInletBranch.x = xpos;
        if( splitterMixerSet ) {
          supplyInletBranch.y = ypos + splitterMixerSet.getBounds().height / 2.0;
        } else {
          supplyInletBranch.y = ypos;
        };
        stage.addChild(supplyInletBranch);
        xpos = xpos + supplyInletBranch.getBounds().width;
      };

      if( splitterMixerSet ) {
        splitterMixerSet.x = xpos;
        splitterMixerSet.y = ypos;
        stage.addChild(splitterMixerSet);
        xpos = xpos + splitterMixerSet.getBounds().width;
      };

      if( supplyOutletBranch ) {
        supplyOutletBranch.x = xpos;
        if( splitterMixerSet ) {
          supplyOutletBranch.y = ypos + splitterMixerSet.getBounds().height / 2.0;
        } else {
          supplyOutletBranch.y = ypos;
        }
        stage.addChild(supplyOutletBranch);
      }
    },

  };


  var stage = new createjs.Stage("demoCanvas");
  var plant = os.openstudio.model.getPlantLoops(os.model).get(0);
  osshapes.drawSupplySide(plant);

  stage.update();
}]);
