'use strict';

/* global google:true, _:true */

// Consumers controller
angular.module('consumers').controller('ConsumersController', [
	'$scope', '$state', '$stateParams', '$location', 'Authentication', 'Consumers', 'Errors',
	function($scope, $state, $stateParams, $location, Authentication, Consumers, Errors) {
		$scope.authentication = Authentication;
		$scope.errors = Errors;
		//console.log(Errors);

		// Clear form fields
		function initializeForm () {
			$scope.firstName = '';
			$scope.lastName = '';
			$scope.address = '';
			$scope.apartment = '';
			$scope.phone = '';
			$scope.product = '';
		}

		$scope.mapConfig = {
			center: {
				latitude: '38.920495',
				longitude: '-77.0427765'
			},
			zoom: 15,
			options: {scrollwheel: false}
		};

		$scope.mapMarker = {
		    id: 0,
		    coords: $scope.mapConfig.center,
		    options: { draggable: true },
		    events: {
		        dragend: function (marker, eventName, args) {
		            $scope.mapMarker.options = {
		                draggable: true,
		                labelAnchor: '100 0',
		                labelClass: 'marker-labels'
		            };

		            var latlng = new google.maps.LatLng(
		            	$scope.mapMarker.coords.latitude,
		            	$scope.mapMarker.coords.longitude
		            );

		            if (!withinArea(latlng)) {
		            	$scope.errors.add('address', 'Address is not within range!');
		            	return;
		            }
		            
		            Geocoder.geocode({'latLng': latlng}, function(results, status) {
						if (status !== google.maps.GeocoderStatus.OK) 
							return console.log('google maps error', status);

						if (results.length <= 0)
							return console.log('error in results', results);

						//console.log(results[0].formatted_address, $scope.firstName);
						$scope.address = results[0].formatted_address;
						$scope.errors.remove('address');
						$scope.$apply();
					});
		        }
		    }
		};

		var Geocoder = new google.maps.Geocoder();

		$scope.mapSearchBoxConfig = {
			options: {
				types: ['address']
			},
			events: {
				places_changed: function (searchBox) {
			        var place = searchBox.getPlaces();
			        if (!place || place.length === 0) {
			            console.log('no place data :(');
			            return;
			        }

			        var position = {
			        	latitude: place[0].geometry.location.lat(),
			        	longitude: place[0].geometry.location.lng()
			        };

			        //console.log(place);
			        $scope.mapConfig.center = position;
			        $scope.mapMarker.coords = position;
			        $scope.address = place[0].formatted_address;
			    }
			},
			template: 'places-autocomplete-template.tmpl.html',
			parentDiv: 'address_input'
		};

		function withinArea (location) {
			var adamsMorgan = new google.maps.Polygon({
	    			paths: [
					    new google.maps.LatLng('38.923275', '-77.047486'),
					    new google.maps.LatLng('38.922724', '-77.042701'),
					    new google.maps.LatLng('38.926530', '-77.036479'),
					    new google.maps.LatLng('38.919134', '-77.036500'),
					    new google.maps.LatLng('38.914410', '-77.046113'),
					    new google.maps.LatLng('38.919268', '-77.049053')
					    //new google.maps.LatLng("38.923275", "-77.047486"),
					]
	  			}),
				lanierHeights = new google.maps.Polygon({
	    			paths: [
					    new google.maps.LatLng('38.926973', '-77.036481'),
					    new google.maps.LatLng('38.927340', '-77.044248'),
					    new google.maps.LatLng('38.923518', '-77.048540'),
					    new google.maps.LatLng('38.922700', '-77.042596'),
					    new google.maps.LatLng('38.926556', '-77.036438')
					]
	  			});

  			var withinAdamsMorgan = google.maps.geometry.poly.containsLocation(location, adamsMorgan),
  				withinLanierHeights = google.maps.geometry.poly.containsLocation(location, lanierHeights);

  			return withinAdamsMorgan || withinLanierHeights;
		}

		// Create new Consumer
		$scope.create = function() {
			// Create new Consumer object
			var consumer = new Consumers.resources ({
				firstName: this.firstName,
				lastName: this.lastName,
				address: this.address,
				apartment: this.apartment,
				product: this.product,
				phone: this.phone
			});

			// Redirect after save
			consumer.$save(function(response) {
				initializeForm();

				if ($stateParams.from_delivery) {
					return $state.go('createDelivery', {from_consumer: true});
				}

				return $location.path('consumers/status/queue');
			}, function(errorResponse) {
				$scope.errors.add('form', errorResponse.data.message);
			});
		};

		// Remove existing Consumer
		$scope.remove = function(consumer) {
			if ( consumer ) { 
				if (_.has(consumer, '$remove'))
					consumer.$remove();
				else
					Consumers.remove(consumer);
				
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
				$scope.errors.add('form', errorResponse.data.message);
			});
		};

		// Find a list of Consumers
		$scope.find = function() {
			Consumers.find({status: $stateParams.status}).success(function (res) {
				$scope.consumers = res;
			}).error(function (err) {
				$scope.errors.add('form', err.data.message);
			});
		};

		// Find existing Consumer
		$scope.findOne = function() {
			$scope.consumer = Consumers.resources.get({ 
				consumerId: $stateParams.consumerId
			});
		};
	}
]);