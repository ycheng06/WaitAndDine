'use strict';

angular.module('myApp.authenticate', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'authenticate/register.html',
    controller: 'AuthController'
  });

  $routeProvider.when('/login', {
    templateUrl: 'authenticate/login.html',
    controller: 'AuthController'
  });
}])

.controller('AuthController', ['$scope', 'authService',
  function($scope, authService){

    $scope.user = {email: '', password: ''};

    // Function to create new user
    $scope.register = function(){
      authService.register($scope.user);
    };

    // Function to login use  r
    $scope.login = function(){
      authService.login($scope.user);
    };

    // Function to logout
    $scope.logout = function(){
      authService.logout();
    };
}]); 
