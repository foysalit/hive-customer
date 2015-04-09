'use strict';

// Deliveries controller
angular.module('deliveries').controller('DeliveriesController', [
	'$scope', '$stateParams', '$location', 'Authentication', 'Deliveries', 'Consumers',
	function($scope, $stateParams, $location, Authentication, Deliveries, Consumers) {
		$scope.authentication = Authentication;

		function initDeliverForm () {
			var model = {
				consumer: '',
				product: ''
			};

			if ($scope.deliveries) {
				$scope.deliveries.push(model);
			} else {
				$scope.deliveries = [model];
			}
		}

		//if (!$stateParams.from_consumer)
			initDeliverForm();

		// Create new Delivery
		$scope.create = function() {
			// Create new Delivery object
			return console.log($scope.deliveries);
			var delivery = new Deliveries ({
				
			});

			// Redirect after save
			delivery.$save(function(response) {
				$location.path('deliveries/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.addDelivery = function () {
			if ($scope.deliveries.length >= 3) {
				$scope.globalError = 'Max 3 deliveries are allowed!';
				return;
			}

			initDeliverForm();
		};

		// Remove existing Delivery
		$scope.remove = function(delivery) {
			if ( delivery ) { 
				delivery.$remove();

				for (var i in $scope.deliveries) {
					if ($scope.deliveries [i] === delivery) {
						$scope.deliveries.splice(i, 1);
					}
				}
			} else {
				$scope.delivery.$remove(function() {
					$location.path('deliveries');
				});
			}
		};

		// Update existing Delivery
		$scope.update = function() {
			var delivery = $scope.delivery;

			delivery.$update(function() {
				$location.path('deliveries/' + delivery._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Deliveries
		$scope.find = function() {
			$scope.deliveries = Deliveries.query();
		};

		$scope.getConsumers = function () {
			$scope.consumers = Consumers.query();
		};

		// Find existing Delivery
		$scope.findOne = function() {
			$scope.delivery = Deliveries.get({ 
				deliveryId: $stateParams.deliveryId
			});
		};

		$scope.calculateTotal = function () {
			if (!$scope.deliveries)
				return 0;

			return $scope.deliveries.length * 3;	
		};
	}
]);