'use strict';

angular.module('myApp.landingPage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'landing_page/landing_page.html',
    controller: 'LandingPageController'
  });
}])

.controller('LandingPageController', [function() {

}]);