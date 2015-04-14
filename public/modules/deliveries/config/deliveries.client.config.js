'use strict';

// Configuring the Articles module
angular.module('deliveries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Deliveries', 'deliveries', 'dropdown', '/deliveries(/create)?');
		Menus.addSubMenuItem('topbar', 'deliveries', 'List Deliveries', 'deliveries');
		Menus.addSubMenuItem('topbar', 'deliveries', 'New Delivery', 'deliveries/create');
		Menus.addSubMenuItem('topbar', 'deliveries', 'Delivery Rceipts', 'deliveries/receipts');
	}
]);