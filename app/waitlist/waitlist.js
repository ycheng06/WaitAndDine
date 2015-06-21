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
		var partiesRef = new Firebase('https://scorching-inferno-9387.firebaseio.com/parties');

		// $scope.parties = $firebaseArray(ref.child("parties"));
		$scope.parties = $firebaseArray(partiesRef);

		$scope.newParty = {name: '', phone: '', size: ''};

		// Function to save party to firebase
		$scope.saveParty = function(){
			$scope.parties.$add($scope.newParty);
			$scope.newParty = {name: '', phone: '', size: ''};
		};

		// Function to remove party from firebase
		$scope.removeParty = function(party){
			$scope.parties.$remove(party);
		};

		// Function to send text message to customer
		$scope.sendTextMessage = function(party){
			var messageRef = new Firebase('https://scorching-inferno-9387.firebaseio.com/textMessages');

			var textMessages = $firebaseArray(messageRef);
			var newTextMessage = {
				phoneNumber: party.phone,
				size: party.size,
				name: party.name
			};
			textMessages.$add(newTextMessage);
		};
}]);