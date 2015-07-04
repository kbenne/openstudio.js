'use strict';

openstudioApp.controller('NavCtrl', ['$scope', '$location', 'Shared', function ($scope, $location, Shared) {
  $scope.tabs = [{
    heading: 'Zones',
    route: 'zones'
  }, {
    heading: 'Systems',
    route: 'systems'
  }];

  function updateActiveTab() {
    // Reset tabs if the page is refreshed
    $scope.tabs.filter(function (element) {
      var regex = new RegExp('^/' + element.route + '$');
      if (regex.test($location.path())) element.active = true;
    });
  }

  updateActiveTab();
}]);
