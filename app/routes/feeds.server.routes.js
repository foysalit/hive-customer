'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var feeds = require('../../app/controllers/feeds.server.controller');

	// Feeds Routes
	app.route('/feeds')
		.get(feeds.list)
		.post(users.requiresLogin, feeds.create);

	app.route('/feeds/:feedId')
		.get(feeds.read)
		.put(users.requiresLogin, feeds.hasAuthorization, feeds.update)
		.delete(users.requiresLogin, feeds.hasAuthorization, feeds.delete);

	// Finish by binding the Feed middleware
	app.param('feedId', feeds.feedByID);
};
