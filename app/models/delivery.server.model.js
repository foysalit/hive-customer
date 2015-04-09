'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var validatePrice = function () {
	return this.price > 0;
};

/**
 * Delivery Schema
 */
var DeliverySchema = new Schema({
	price: {
		type: Number,
		default: 3,
		validate: [validatePrice, 'Price Must be set']
	},
	created: {
		type: Date,
		default: Date.now
	},
	consumer: {
		type: Schema.ObjectId,
		ref: 'Consumer'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Delivery', DeliverySchema);