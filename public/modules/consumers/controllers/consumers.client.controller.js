'use strict';

// Consumers controller
angular.module('consumers').controller('ConsumersController', [
	'$scope', '$state', '$stateParams', '$location', 'Authentication', 'Consumers',
	function($scope, $state, $stateParams, $location, Authentication, Consumers) {
		$scope.authentication = Authentication;

		// Clear form fields
		function initializeForm () {
			$scope.firstName = '';
			$scope.lastName = '';
			$scope.address = '';
			$scope.apartment = '';
			$scope.phone = '';
		}

		$scope.mapConfig = {
			center: {
				latitude: '38.920495',
				longitude: '-77.0427765'
			},
			zoom: 15,
			options: {scrollwheel: false}
		};

		$scope.mapSearchBoxConfig = {
			options: {
				types: ['address']
			},
			events: 'places_changed',
			template: 'places-autocomplete-template.tmpl.html',
			parentDiv: 'address_input'
		};

		// Create new Consumer
		$scope.create = function() {
			// Create new Consumer object
			var consumer = new Consumers ({
				firstName: this.firstName,
				lastName: this.lastName,
				address: this.address,
				apartment: this.apartment,
				phone: this.phone
			});

			// Redirect after save
			consumer.$save(function(response) {
				initializeForm();

				if ($stateParams.from_delivery) {
					return $state.go('createDelivery', {from_consumer: true});
				}

				return $location.path('consumers/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Consumer
		$scope.remove = function(consumer) {
			if ( consumer ) { 
				consumer.$remove();

				for (var i in $scope.consumers) {
					if ($scope.consumers [i] === consumer) {
						$scope.consumers.splice(i, 1);
					}
				}
			} else {
				$scope.consumer.$remove(function() {
					$location.path('consumers');
				});
			}
		};

		// Update existing Consumer
		$scope.update = function() {
			var consumer = $scope.consumer;

			consumer.$update(function() {
				$location.path('consumers/' + consumer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Consumers
		$scope.find = function() {
			$scope.consumers = Consumers.query();
		};

		// Find existing Consumer
		$scope.findOne = function() {
			$scope.consumer = Consumers.get({ 
				consumerId: $stateParams.consumerId
			});
		};
	}
]);