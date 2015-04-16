'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');

var validation = {
	product: function (product) {
		var availableProducts = ['large-pizza', 'medium-pizza', 'small-pizza'];
		return product.length && _.contains(availableProducts, product);
	},
	general: function(property) {
		return property.length;
	}
};

/**
 * Consumer Schema
 */
var ConsumerSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validation.general, 'Please fill in consumer\'s first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validation.general, 'Please fill in consumer\'s last name']
	},
	address: {
		type: String,
		trim: true,
		default: '',
		validate: [validation.general, 'Please fill in consumer\'s address']
	},
	apartment: {
		type: String,
		trim: true,
		default: ''
	},
	phone: {
		type: String,
		trim: true,
		default: ''
	},
	product: {
		type: String,
		trim: true,
		default: '',
		validate: [validation.product, 'Product is not valid']
	},
	status: {
		type: String,
		trim: true,
		default: 'queue',
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Consumer', ConsumerSchema);