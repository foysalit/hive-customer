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
		required: 'Please fill Feed name',
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
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Feed', FeedSchema);