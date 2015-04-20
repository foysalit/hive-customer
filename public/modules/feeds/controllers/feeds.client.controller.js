'use strict';

// Feeds controller
angular.module('feeds').controller('FeedsController', [
	'$scope', '$stateParams', '$location', 'Socket', 'Authentication', 'Feeds',
	function($scope, $stateParams, $location, Socket, Authentication, Feeds) {
		$scope.authentication = Authentication;

		Socket.on('feeds.new', function (data) {
			console.log(data);

			$scope.feeds.push(data);
		});

		// Remove existing Feed
		$scope.remove = function(feed) {
			if ( feed ) { 
				feed.$remove();

				for (var i in $scope.feeds) {
					if ($scope.feeds [i] === feed) {
						$scope.feeds.splice(i, 1);
					}
				}
			} else {
				$scope.feed.$remove(function() {
					$location.path('feeds');
				});
			}
		};

		// Find a list of Feeds
		$scope.find = function() {
			Feeds.find().success(function (feeds) {
				console.log(feeds);
				$scope.feeds = feeds;
			}).error(function (err) {
				console.log(err);
			});
		};
	}
]);