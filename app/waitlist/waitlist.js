'use strict';

angular.module('myApp.waitlist', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/waitlist', {
    templateUrl: 'waitlist/waitlist.html',
    controller: 'WaitlistController'
  });
}])

.controller('WaitlistController', ['$scope', '$firebaseArray', 
	function($scope, $firebaseArray) {
		var ref = new Firebase('https://scorching-inferno-9387.firebaseio.com/');

		$scope.parties = $firebaseArray(ref.child("parties"));

		$scope.party = {name: '', phone: '', size: ''};

		$scope.saveParty = function(){
			$scope.parties.$add($scope.party);
			$scope.party = {name: '', phone: '', size: ''};
		};
}]);