'use strict';

/* global _:true */

// Deliveries controller
angular.module('deliveries').controller('DeliveriesController', [
	'$scope', '$state', '$stateParams', '$location', '$modal', 'Socket', 'Authentication', 'Deliveries', 'Consumers',
	function($scope, $state, $stateParams, $location, $modal, Socket, Authentication, Deliveries, Consumers) {
		$scope.authentication = Authentication;

		function initDeliverForm () {
			var model = {
				consumer: '',
				product: '',
				compartment: ($scope.deliveries) ? $scope.deliveries.length + 1 : 1
			};

			if ($scope.deliveries) {
				$scope.deliveries.push(model);
			} else {
				$scope.deliveries = [model];
			}
		}

		function showConfirmation (deliveries) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/deliveries/views/confirmation-modal.client.view.html',
				controller: function ($scope, $modalInstance, deliveries) {
					$scope.deliveries = deliveries;
					
					$scope.closeConfirmation = function (path) {
						$modalInstance.dismiss('cancel');
						$location.path(path);
					};
				},
				//size: 'size',
				resolve: {
					deliveries: function () {
						return deliveries;
					}
				}
			});
		}

		function showPhotoReceipt (delivery) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/deliveries/views/photo-receipt-modal.client.view.html',
				controller: function ($scope, $modalInstance, delivery) {
					$scope.delivery = delivery;
					
					$scope.closeModal = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				//size: 'size',
				resolve: {
					delivery: function () {
						return delivery;
					}
				}
			});
		}

		//if (!$stateParams.from_consumer)
			initDeliverForm();

		// Create new Delivery
		$scope.create = function() {
			// Create new Delivery object
			//return console.log($scope.deliveries);
			Deliveries.saveMultiple($scope.deliveries).success(function (response) {
				if (response.error) {
					return console.log('error', response);
				}

				showConfirmation($scope.deliveries);
			}).error(function (err) {
				console.log('error', err);
				$scope.error = err.data.message;
			});
		};

		$scope.addDelivery = function () {
			if ($scope.deliveries.length >= 3) {
				$scope.globalError = 'Max 3 deliveries are allowed!';
				return;
			}

			initDeliverForm();
		};

		$scope.orderSelected = function ($item, $model) {
			_.pull($scope.consumers, $item);
		};

		$scope.getDeliveries = function (q) {
			var query = _.extend({}, q);

			if ($state.is('deliveryReceipts')) {
				query.status = 'fulfilled';
			}

			Deliveries.find(query).success(function (deliveries) {
				//console.log(deliveries);
				$scope.deliveries = deliveries;
			}).error(function (err) {
				console.log(err);
			});
		};

		Socket.on('deliveries.update', function (data) {
			$scope.getDeliveries();
		});

		$scope.showPhotoReceipt = showPhotoReceipt;

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
			$scope.deliveries = Deliveries.resource.query();
		};

		$scope.getConsumers = function () {
			$scope.consumers = Consumers.query();
		};

		// Find existing Delivery
		$scope.findOne = function() {
			$scope.delivery = Deliveries.resource.get({ 
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