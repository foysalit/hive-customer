'use strict';

//Consumers service used to communicate Consumers REST endpoints
angular.module('consumers').factory('Consumers', ['$resource',
	function($resource) {
		return $resource('consumers/:consumerId', { consumerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);