'use strict';

angular.module('myApp.waitlist', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/waitlist', {
    templateUrl: 'waitlist/waitlist.html',
    controller: 'WaitlistController'
  });
}])

.controller('WaitlistController', ['$scope', 'partyService', 'dataService', 'textMessageService',
	function($scope, partyService, dataService, textMessageService) {
		$scope.parties = partyService.getParties($scope.currentUser.uid);
		$scope.newParty = {name: '', phone: '', size: '', done: false, notified: "No"};

		// Function to save party to firebase
		$scope.saveParty = function(){
			partyService.saveParty($scope.newParty, $scope.currentUser.uid);
		};

		// Function to remove party from firebase
		$scope.removeParty = function(party){
			partyService.removeParty(party, $scope.currentUser.uid);
		};

		// Function to send text message to customer
		$scope.sendTextMessage = function(party){
			textMessageService.sendTextMessage(party, $scope.currentUser.uid);
		};
}]);