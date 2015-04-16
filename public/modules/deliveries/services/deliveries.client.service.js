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
		},
		validateMultiple: function (deliveries) {
			var self = this;

			for (var i = 0; i < deliveries.length; i++) {
				var validation = self.validate(deliveries[i]);

				if (validation.error)
					return validation;
			}

			return true;
		},
		validate: function (delivery) {
			if (_.isUndefined(delivery.consumer) || _.isEmpty(delivery.consumer))
				return {error: 'Must select a consumer'};
			
			if (delivery.consumer.status !== 'queue')
				return {error: 'Only queued orders can be delivered'};

			return {error: false};
		}
	};
}]);