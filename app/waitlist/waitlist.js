'use strict';

angular.module('myApp.waitlist', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/waitlist', {
    templateUrl: 'waitlist/waitlist.html',
    controller: 'WaitlistController'
  });
}])

.controller('WaitlistController', ['$scope', 'partyService',
	function($scope, partyService) {
		$scope.parties = partyService.parties;
		$scope.newParty = {name: '', phone: '', size: '', done: false, notified: "No"};

		// Function to save party to firebase
		$scope.saveParty = function(){
			partyService.saveParty($scope.newParty);
		};

		// Function to remove party from firebase
		$scope.removeParty = function(party){
			partyService.removeParty(party);
		};

		// Function to send text message to customer
		$scope.sendTextMessage = function(party){
			var messageRef = new Firebase(FIREBASE_URL + 'textMessages');

			var textMessages = $firebaseArray(messageRef);
			var newTextMessage = {
				phoneNumber: party.phone,
				size: party.size,
				name: party.name
			};
			textMessages.$add(newTextMessage);

			party.notified = "Yes";
			$scope.parties.$save(party);
		};
}]);