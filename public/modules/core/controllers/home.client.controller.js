'use strict';


angular.module('core').controller('HomeController', [
	'$scope', 'Feeds', '$location', 'Authentication',
	function($scope, Feed, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		if (!$scope.authentication.user) {
			$location.path('signin');
		}

		$scope.activities = [{
			timeStamp: new Date(),
			text: '[consumer fname], [consumer lname] @ [consumer address] . [link to full receipt in receipt table] .'			
		}, {
			timeStamp: new Date(),
			text: 'This is second text update'			
		}];
	}
]);