'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');

var validation = {
	price: function () {
		return this.price > 0;
	},
	product: function () {
		var availableProducts = ['large-pizza', 'medium-pizza', 'small-pizza'];
		return this.product && _.contains(availableProducts, this.product);
	},
	compartment: function () {
		return this.compartment && this.compartment <= 3 && this.compartment > 0;
	}
};
/**
 * Delivery Schema
 */
var DeliverySchema = new Schema({
	price: {
		type: Number,
		default: 3,
		validate: [validation.price, 'Price Must be set']
	},
	compartment: {
		type: Number,
		validate: [validation.compartment, 'Compartment is not valid']
	},
	product: {
		type: String,
		validate: [validation.product, 'Product is not valid']
	},
	totalTime: {
		type: String
	},
	photoReceipt: {
		type: String
	},
	status: {
		type: String,
		trim: true,
		default: 'unfulfilled',
		required: true
	},
	completedAt: {
		type: String
	},
	createdAt: {
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