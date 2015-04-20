'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Feed = mongoose.model('Feed'),
	_ = require('lodash');

/**
 * Create a Feed
 */
exports.create = function(req, res) {
	var feed = new Feed(req.body);

	feed.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio');
			socketio.sockets.emit('feeds.new', feed);
			res.jsonp(feed);
		}
	});
};

/**
 * Show the current Feed
 */
exports.read = function(req, res) {
	res.jsonp(req.feed);
};

/**
 * Update a Feed
 */
exports.update = function(req, res) {
	var feed = req.feed ;

	feed = _.extend(feed , req.body);

	feed.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feed);
		}
	});
};

/**
 * Delete an Feed
 */
exports.delete = function(req, res) {
	var feed = req.feed ;

	feed.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(feed);
		}
	});
};

/**
 * List of Feeds
 */
exports.list = function(req, res) { 
	Feed.find()
		.sort('-createdAt')
		.populate('delivery')
		.exec(function(err, feeds) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(feeds);
			}
		});
};

/**
 * Feed middleware
 */
exports.feedByID = function(req, res, next, id) { 
	Feed.findById(id).populate('user', 'displayName').exec(function(err, feed) {
		if (err) return next(err);
		if (! feed) return next(new Error('Failed to load Feed ' + id));
		req.feed = feed ;
		next();
	});
};

/**
 * Feed authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.feed.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
