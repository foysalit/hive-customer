'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var validateProperty = function(property) {
	return (!this.updated || property.length);
};

/**
 * Consumer Schema
 */
var ConsumerSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateProperty, 'Please fill in consumer\'s first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateProperty, 'Please fill in consumer\'s last name']
	},
	address: {
		type: String,
		trim: true,
		default: '',
		validate: [validateProperty, 'Please fill in consumer\'s address']
	},
	apartment: {
		type: String,
		trim: true,
		default: ''
	},
	phone: {
		type: String,
		trim: true,
		default: '',
		validate: [validateProperty, 'Please fill in your phone number']
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