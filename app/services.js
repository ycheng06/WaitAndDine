'use strict';

angular.module('myApp.services', [])
	.value('FIREBASE_URL', 'https://scorching-inferno-9387.firebaseio.com/')
	// Service that takes care of adding and removing party to FireBase
	.factory('partyService', function($firebaseArray, FIREBASE_URL){
		var partiesRef = new Firebase(FIREBASE_URL + 'parties');

		var parties = $firebaseArray(partiesRef);

		var partyServiceObject = {
			parties: parties,
			saveParty: function(party){
				parties.$add(party);
			},
			removeParty: function(party){
				parties.$remove(party);
			}
		};

		return partyServiceObject;
	})	
	// Service that handles register, login, and logout
	.factory('authService', function($firebaseAuth, $location, FIREBASE_URL, $rootScope){
	    var authRef = new Firebase(FIREBASE_URL);
	    var auth = $firebaseAuth(authRef);

	    var authServiceObject = {
	    	register: function(user){
	    		//create user
	    		auth.$createUser(user)
	    		.then(function(userDate){
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