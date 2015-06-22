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

.controller('AuthController', ['$scope', '$firebaseAuth',
  function($scope, $firebaseAuth){
    var authRef = new Firebase('https://scorching-inferno-9387.firebaseio.com/');
    var auth = $firebaseAuth(authRef);

    $scope.user = {email: '', password: ''};

    // Function to create new user
    $scope.register = function(){
      auth.$createUser($scope.user)
      .then(function(userData){
        console.log("User " + userData.uid + " created successfully")
      });
    };

    // Function to login user
    $scope.login = function(){
      auth.$authWithPassword($scope.user)
      .then(function(authData){
        console.log("Logged in as: " + authData.uid);
      })
      .catch(function(error){
        console.error("Authentication error: " + error);
      });
    };

    // Function to logout
    $scope.logout = function(){
      auth.$unauth();
    };
}]); 
