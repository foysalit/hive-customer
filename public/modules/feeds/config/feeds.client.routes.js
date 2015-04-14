'use strict';

//Setting up route
angular.module('feeds').config(['$stateProvider',
	function($stateProvider) {
		// Feeds state routing
		$stateProvider.
		state('listFeeds', {
			url: '/feeds',
			templateUrl: 'modules/feeds/views/list-feeds.client.view.html'
		}).
		state('createFeed', {
			url: '/feeds/create',
			templateUrl: 'modules/feeds/views/create-feed.client.view.html'
		}).
		state('viewFeed', {
			url: '/feeds/:feedId',
			templateUrl: 'modules/feeds/views/view-feed.client.view.html'
		}).
		state('editFeed', {
			url: '/feeds/:feedId/edit',
			templateUrl: 'modules/feeds/views/edit-feed.client.view.html'
		});
	}
]);