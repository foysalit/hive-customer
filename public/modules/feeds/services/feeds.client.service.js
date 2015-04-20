'use strict';

//Feeds service used to communicate Feeds REST endpoints
angular.module('feeds').factory('Feeds', ['$resource', '$http',
function($resource, $http) {
	var endPoint = 'feeds';

	return {
		find: function (query) {
			var options = {};

			if (query) {
				options.params = query;
			}

			return $http.get(endPoint, options);
		}
	};
}]);