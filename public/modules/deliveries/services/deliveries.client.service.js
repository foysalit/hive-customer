'use strict';

//Deliveries service used to communicate Deliveries REST endpoints
angular.module('deliveries').factory('Deliveries', ['$resource', '$http',
function($resource, $http) {
	var endPoint = 'deliveries';

	return {
		resource: $resource(endPoint +'/:deliveryId', { 
			deliveryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		}),
		saveMultiple: function (deliveries) {
			return $http.post(endPoint +'/multiple', deliveries);
		},
		find: function (query) {
			var options = {};

			if (query) {
				options.params = query;
			}

			return $http.get(endPoint, options);
		}
	};
}]);