'use strict';

openstudioApp.controller('SystemsCtrl', ['$scope', '$log', 'os', function ($scope, $log, os) {
  $scope.standardUnit = 100;
  $scope.width = 3000;
  $scope.height = 300;
  $scope.paper = Raphael('systems-canvas', $scope.width, $scope.height);
  // Fix for subpixel aliasing
  $scope.paper.setViewBox(0.5, 0.5, $scope.width, $scope.height);

  $scope.addStraightComponent = function (x, y) {
    var line = $scope.paper.path(['M', x, y, 'l', $scope.standardUnit, 0]);
  };
  $scope.addNode = function (x, y) {
    var line = $scope.paper.path(['M', x, y, 'l', $scope.standardUnit, 0]);
    var circle = $scope.paper.circle($scope.standardUnit / 2 + x, y, 7).attr('fill', 'black');
  };

  os.openstudio.model.addSystemType7(os.model);
  var plant = os.openstudio.model.getPlantLoops(os.model).get(0);
  var supplyComps = plant.supplyComponents();

  for (var i = 0; i < supplyComps.size(); ++i) {
    var modelObject = supplyComps.get(i);
    var x = i * ($scope.standardUnit + 10);
    var y = 50;

    if (os.openstudio.model.toNode(modelObject).isNull()) {
      $scope.addStraightComponent(x, y);
    } else {
      $scope.addNode(x, y);
    }
  }
}]);
