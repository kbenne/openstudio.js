'use strict';

openstudioApp.controller('SystemsCtrl', ['$scope', '$log', 'os', function ($scope, $log, os) {

  var osshapes = {
    standardUnit: 100.0,

    getShape: function (modelObject) {
      var result = {};
      if (os.openstudio.model.toNode(modelObject).isNull()) {
        result = new osshapes.StraightComponent();
      } else {
        result = new osshapes.Node();
      }
      return result;
    },

    StraightComponent: function () {
      shape = new createjs.Shape();
      shape.graphics.beginStroke("black").moveTo(0.0, 0.0).lineTo(osshapes.standardUnit, 0.0);
      return shape;
    },

    Node: function () {
      var shape = new createjs.Shape();
      shape.graphics.beginStroke("black").moveTo(0.0, 0.0).lineTo(osshapes.standardUnit, 0.0);
      shape.graphics.beginFill("black").drawCircle(osshapes.standardUnit / 2.0, 0, 7.0);
      return shape;
    }
  };

  os.openstudio.model.addSystemType7(os.model);
  var plant = os.openstudio.model.getPlantLoops(os.model).get(0);
  var supplyComps = plant.supplyComponents();

  var stage = new createjs.Stage("demoCanvas");

  for (var i = 0; i < supplyComps.size(); ++i) {
    var shape = osshapes.getShape(supplyComps.get(i));
    shape.x = i * (osshapes.standardUnit + 10.0);
    shape.y = 50.0;
    stage.addChild(shape);
  }

  stage.update();
}]);
