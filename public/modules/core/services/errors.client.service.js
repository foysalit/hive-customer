'use strict';

/* global _:true */

angular.module('core').service('Errors', [function() {
	this.all = {};

	this.add = function (key, message, type) {
		type = type || 'error';
		this.all[key] = message;
	};

	this.remove = function (key) {
		if (this.has(key))
			delete this.all[key];
	};

	this.has = function (key) {
		if (!_.isUndefined(key)) {
			return _.has(this.all, key);
		}

		return _.keys(this.all).length > 0;
	};
}]);