'use strict';

angular.module('myApp.services', [])
	.value('FIREBASE_URL', 'https://scorching-inferno-9387.firebaseio.com/')

	// Service to simplify the Firebase connection used in many places
	.factory('dataService', function($firebaseArray, FIREBASE_URL){

		var dataServiceObject = {
			getPartyArray: function(userId){
				var ref = new Firebase(FIREBASE_URL).child('users').child(userId).child('parties');
				return $firebaseArray(ref);
			},
			getMessageArray: function(){
				var ref = new Firebase(FIREBASE_URL).child('textMessages');
				return $firebaseArray(ref);
			},
			getEmailArray: function(){
				var ref = new Firebase(FIREBASE_URL).child('emails');
				return $firebaseArray(ref);
			}
		}

		return dataServiceObject;
	})

	// Service that takes care of adding and removing party to FireBase
	.factory('partyService', function(dataService){

		var partyServiceObject = {
			getParties: function(userId){
				// /users/<userid>/parties
				var userParties = dataService.getPartyArray(userId);

				return userParties;
			},
			saveParty: function(party, userId){
				var userParties = dataService.getPartyArray(userId);
				userParties.$add(party);
			},
			removeParty: function(party, userId){
				var userParties = dataService.getPartyArray(userId);
				userParties.$remove(party);
			}
		};

		return partyServiceObject;
	})	

	// Service to send text message to ready party
	.factory('textMessageService', function(dataService, partyService){
		var textMessageServiceObject = {
			sendTextMessage: function(party, userId){
				var textMessages = dataService.getMessageArray();

				var newTextMessage = {
					phoneNumber: party.phone,
					size: party.size,
					name: party.name
				};
				textMessages.$add(newTextMessage);

				// Firebase array are loaded asychronously, so need to use a promise
				// to wait until the data is loaded to make changes
				var parties = partyService.getParties(userId);
				parties.$loaded()
				.then(function(x){
					var oldParty = parties.$getRecord(party.$id);
					console.log(oldParty);
					oldParty.notified = "Yes";
					parties.$save(oldParty);
				});
			}
		}

		return textMessageServiceObject;
	})
	
	// Service that handles register, login, and logout
	.factory('authService', function($firebaseAuth, $location, FIREBASE_URL, $rootScope, dataService){
	    var authRef = new Firebase(FIREBASE_URL);
	    var auth = $firebaseAuth(authRef);
	    var emails = dataService.getEmailArray();

	    var authServiceObject = {
	    	register: function(user){
	    		//create user
	    		auth.$createUser(user)
	    		.then(function(userDate){
	    			// Send registered email to user
	    			emails.$add({email: user.email});

	    			//if no problem then login 
	    			authServiceObject.login(user);
	    		});
	    	},
	    	login: function(user){
	    		auth.$authWithPassword(user)
      			.then(function(authData){
			        console.log("Logged in as: " + authData.uid);
			        $location.path('/waitlist');
			     })
		    	.catch(function(error){
		        	console.error("Authentication error: " + error);
      			});
	    	},
	    	logout: function(){
	    		auth.$unauth();
	    		$location.path('/');
	    	}
	    };

	    // Listen to login and logout event
	    auth.$onAuth(function(authData){
	    	if(authData){
	    		//logged in
	    		$rootScope.currentUser = authData;
	    	} else {
	    		//logged out
	    		$rootScope.currentUser = null;
	    	}
	    });

	    return authServiceObject;
	});