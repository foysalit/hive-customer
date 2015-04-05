'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Consumer = mongoose.model('Consumer'),
	_ = require('lodash');

/**
 * Create a Consumer
 */
exports.create = function(req, res) {
	var consumer = new Consumer(req.body);
	consumer.user = req.user;

	consumer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumer);
		}
	});
};

/**
 * Show the current Consumer
 */
exports.read = function(req, res) {
	res.jsonp(req.consumer);
};

/**
 * Update a Consumer
 */
exports.update = function(req, res) {
	var consumer = req.consumer ;

	consumer = _.extend(consumer , req.body);

	consumer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumer);
		}
	});
};

/**
 * Delete an Consumer
 */
exports.delete = function(req, res) {
	var consumer = req.consumer ;

	consumer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumer);
		}
	});
};

/**
 * List of Consumers
 */
exports.list = function(req, res) { 
	Consumer.find().sort('-created').populate('user', 'displayName').exec(function(err, consumers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(consumers);
		}
	});
};

/**
 * Consumer middleware
 */
exports.consumerByID = function(req, res, next, id) { 
	Consumer.findById(id).populate('user', 'displayName').exec(function(err, consumer) {
		if (err) return next(err);
		if (! consumer) return next(new Error('Failed to load Consumer ' + id));
		req.consumer = consumer ;
		next();
	});
};

/**
 * Consumer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.consumer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
