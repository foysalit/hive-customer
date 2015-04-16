'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Delivery = mongoose.model('Delivery'),
	Consumer = mongoose.model('Consumer'),
	_ = require('lodash');

/**
 * Create a Delivery
 */
exports.create = function(req, res) {
	var delivery = new Delivery(req.body);
	delivery.user = req.user;

	delivery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * Create multiple Deliveries
 */
exports.createMultiple = function(req, res) {
	var deliveries = [];

	_.each(req.body, function (delivery) {
		//console.log(delivery.consumer);
		Consumer.update({_id: delivery.consumer._id}, {status: 'delivery'}, {});

		delivery.user = req.user;
		delivery.consumer = delivery.consumer._id;
		deliveries.push(delivery);
	});

	Delivery.create(deliveries, function(err, result) {
		//console.log(err, result);
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json({
				error: false,
				deliveries: deliveries
			});
		}
	});
};

/**
 * Show the current Delivery
 */
exports.read = function(req, res) {
	res.jsonp(req.delivery);
};

/**
 * Update a Delivery
 */
exports.update = function(req, res) {
	var delivery = req.delivery;

	delivery = _.extend(delivery , req.body);

	delivery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio');
			socketio.sockets.emit('deliveries.update', delivery);
			res.jsonp(delivery);
		}
	});
};

/**
 * Delete an Delivery
 */
exports.delete = function(req, res) {
	var delivery = req.delivery ;

	delivery.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * List of Deliveries
 */
exports.list = function(req, res) { 
	Delivery.find(req.query)
		.sort('-created')
		.populate('consumer')
		.exec(function(err, deliveries) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(deliveries);
			}
		});
};

/**
 * Delivery middleware
 */
exports.deliveryByID = function(req, res, next, id) { 
	Delivery.findById(id).populate('user', 'displayName').exec(function(err, delivery) {
		if (err) return next(err);
		if (! delivery) return next(new Error('Failed to load Delivery ' + id));
		req.delivery = delivery ;
		next();
	});
};

/**
 * Delivery authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.delivery.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
