'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Feed = mongoose.model('Feed'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, feed;

/**
 * Feed routes tests
 */
describe('Feed CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Feed
		user.save(function() {
			feed = {
				name: 'Feed Name'
			};

			done();
		});
	});

	it('should be able to save Feed instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feed
				agent.post('/feeds')
					.send(feed)
					.expect(200)
					.end(function(feedSaveErr, feedSaveRes) {
						// Handle Feed save error
						if (feedSaveErr) done(feedSaveErr);

						// Get a list of Feeds
						agent.get('/feeds')
							.end(function(feedsGetErr, feedsGetRes) {
								// Handle Feed save error
								if (feedsGetErr) done(feedsGetErr);

								// Get Feeds list
								var feeds = feedsGetRes.body;

								// Set assertions
								(feeds[0].user._id).should.equal(userId);
								(feeds[0].name).should.match('Feed Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Feed instance if not logged in', function(done) {
		agent.post('/feeds')
			.send(feed)
			.expect(401)
			.end(function(feedSaveErr, feedSaveRes) {
				// Call the assertion callback
				done(feedSaveErr);
			});
	});

	it('should not be able to save Feed instance if no name is provided', function(done) {
		// Invalidate name field
		feed.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feed
				agent.post('/feeds')
					.send(feed)
					.expect(400)
					.end(function(feedSaveErr, feedSaveRes) {
						// Set message assertion
						(feedSaveRes.body.message).should.match('Please fill Feed name');
						
						// Handle Feed save error
						done(feedSaveErr);
					});
			});
	});

	it('should be able to update Feed instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feed
				agent.post('/feeds')
					.send(feed)
					.expect(200)
					.end(function(feedSaveErr, feedSaveRes) {
						// Handle Feed save error
						if (feedSaveErr) done(feedSaveErr);

						// Update Feed name
						feed.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Feed
						agent.put('/feeds/' + feedSaveRes.body._id)
							.send(feed)
							.expect(200)
							.end(function(feedUpdateErr, feedUpdateRes) {
								// Handle Feed update error
								if (feedUpdateErr) done(feedUpdateErr);

								// Set assertions
								(feedUpdateRes.body._id).should.equal(feedSaveRes.body._id);
								(feedUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Feeds if not signed in', function(done) {
		// Create new Feed model instance
		var feedObj = new Feed(feed);

		// Save the Feed
		feedObj.save(function() {
			// Request Feeds
			request(app).get('/feeds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Feed if not signed in', function(done) {
		// Create new Feed model instance
		var feedObj = new Feed(feed);

		// Save the Feed
		feedObj.save(function() {
			request(app).get('/feeds/' + feedObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', feed.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Feed instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Feed
				agent.post('/feeds')
					.send(feed)
					.expect(200)
					.end(function(feedSaveErr, feedSaveRes) {
						// Handle Feed save error
						if (feedSaveErr) done(feedSaveErr);

						// Delete existing Feed
						agent.delete('/feeds/' + feedSaveRes.body._id)
							.send(feed)
							.expect(200)
							.end(function(feedDeleteErr, feedDeleteRes) {
								// Handle Feed error error
								if (feedDeleteErr) done(feedDeleteErr);

								// Set assertions
								(feedDeleteRes.body._id).should.equal(feedSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Feed instance if not signed in', function(done) {
		// Set Feed user 
		feed.user = user;

		// Create new Feed model instance
		var feedObj = new Feed(feed);

		// Save the Feed
		feedObj.save(function() {
			// Try deleting Feed
			request(app).delete('/feeds/' + feedObj._id)
			.expect(401)
			.end(function(feedDeleteErr, feedDeleteRes) {
				// Set message assertion
				(feedDeleteRes.body.message).should.match('User is not logged in');

				// Handle Feed error error
				done(feedDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Feed.remove().exec();
		done();
	});
});