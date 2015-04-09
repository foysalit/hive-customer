'use strict';

//Deliveries service used to communicate Deliveries REST endpoints
angular.module('deliveries').factory('Deliveries', ['$resource', '$http',
function($resource, $http) {
	return {
		resource: $resource('deliveries/:deliveryId', { 
			deliveryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		}),
		saveMultiple: function (deliveries) {
			return $http.post('deliveries/multiple', deliveries);
		}
	};
}]);