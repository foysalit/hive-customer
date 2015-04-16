'use strict';

// Configuring the Articles module
angular.module('consumers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Orders', 'consumers', 'dropdown', '/consumers(/create)?');
		Menus.addSubMenuItem('topbar', 'consumers', 'Orders In Queue', 'consumers/status/queue');
		Menus.addSubMenuItem('topbar', 'consumers', 'Orders In Delivery', 'consumers/status/delivery');
		Menus.addSubMenuItem('topbar', 'consumers', 'New Order', 'consumers/create');
	}
]);