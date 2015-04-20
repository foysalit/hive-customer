'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Feed Schema
 */
var FeedSchema = new Schema({
	text: {
		type: String,
		default: '',
		required: 'Please fill Feed content',
		trim: true
	},
	type: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	delivery: {
		type: Schema.ObjectId,
		ref: 'Delivery'
	}
});

mongoose.model('Feed', FeedSchema);