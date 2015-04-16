'use strict';

//Consumers service used to communicate Consumers REST endpoints
angular.module('consumers').factory('Consumers', ['$resource', '$http',
function($resource, $http) {
	var endPoint = 'consumers';
	var resourceInstance = $resource(endPoint +'/:consumerId', {
			consumerId: '@_id'
		}, {
			update: {method: 'PUT'}
		});

	return {
		resources: resourceInstance,
		find: function (query) {
			var options = {};

			if (query) {
				options.params = query;
			}

			return $http.get(endPoint, options);
		},
		remove: function (consumer) {
			return $http.delete(endPoint +'/'+ consumer._id);
		}
	};
}]);